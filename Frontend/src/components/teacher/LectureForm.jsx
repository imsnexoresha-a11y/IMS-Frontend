import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { useTopics } from '../../hooks/useTopics';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as teacherApi from '../../api/teacherApi';

export default function LectureForm({ batchId, onSubmit, onCancel, defaultValues }) {
  const resolvedBatchId = batchId || 'batch-001';
  const queryClient = useQueryClient();

  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const [isCreateTopicOpen, setIsCreateTopicOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

  // Fetch topics in the current batch for the select dropdown
  const { data: topics = [] } = useTopics(resolvedBatchId);
  const topicOptions = topics.map((t) => ({ value: t._id || t.id, label: t.title }));

  // Fetch courses to find the courseId linked to this batch
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: teacherApi.getCourses,
  });

  const courseOptions = courses
    .filter((c) => c.batchId === resolvedBatchId)
    .map((c) => ({ value: c._id || c.id, label: c.name }));

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      courseId: '',
      topicId: '',
      duration: '2 hours',
      sessionDateAndTime: '',
      startTime: '',
      endTime: '',
      half1EndTime: '',
      meetUrl: '',
      assignmentTitle: '',
      assignmentDescription: '',
      assignmentDeadline: '',
      githubRepoSeed: '',
    },
  });

  const sessionDateAndTime = watch('sessionDateAndTime');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  // Auto-calculate duration if startTime and endTime are input
  useEffect(() => {
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      
      let diffMins = (eh * 60 + em) - (sh * 60 + sm);
      if (diffMins < 0) {
        // Assume wraps to next day
        diffMins += 24 * 60;
      }
      
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      
      let durationStr = '';
      if (hours > 0) durationStr += `${hours} hour${hours > 1 ? 's' : ''}`;
      if (mins > 0) durationStr += `${durationStr ? ' ' : ''}${mins} min${mins > 1 ? 's' : ''}`;
      
      setValue('duration', durationStr || '0 mins');
    }
  }, [startTime, endTime, setValue]);

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    setIsCreating(true);
    try {
      const res = await teacherApi.createCourse({
        name: newCourseName,
        batchId: resolvedBatchId,
      });
      const newCourseId = res._id || res.id;
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
      setValue('courseId', newCourseId);
      setIsCreateCourseOpen(false);
      setNewCourseName('');
    } catch (err) {
      alert(err.message || 'Failed to create course');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateTopic = async () => {
    if (!newTopicName.trim()) return;
    setIsCreatingTopic(true);
    try {
      const res = await teacherApi.createTopic(resolvedBatchId, {
        title: newTopicName,
      });
      const newTopicId = res.topic?._id || res.topic?.id || res._id || res.id;
      await queryClient.invalidateQueries({ queryKey: ['topics', resolvedBatchId] });
      setValue('topicId', newTopicId);
      setIsCreateTopicOpen(false);
      setNewTopicName('');
    } catch (err) {
      alert(err.message || 'Failed to create topic');
    } finally {
      setIsCreatingTopic(false);
    }
  };

  const handleFormSubmit = (data) => {
    // Combine date and startTime into a valid ISO8601 string
    let sessionDateAndTime = data.sessionDateAndTime;
    if (data.sessionDateAndTime && data.startTime) {
      const datePart = data.sessionDateAndTime.includes('T')
        ? data.sessionDateAndTime.split('T')[0]
        : data.sessionDateAndTime;
      sessionDateAndTime = new Date(`${datePart}T${data.startTime}:00`).toISOString();
    }

    // Convert assignmentDeadline to a valid ISO8601 string
    let assignmentDeadline = data.assignmentDeadline;
    if (data.assignmentDeadline) {
      assignmentDeadline = new Date(data.assignmentDeadline).toISOString();
    }

    // Format payload for backend expectations
    const payload = {
      ...data,
      topicIds: [data.topicId], // API expects an array of topic IDs
      sessionDateAndTime,
      assignmentDeadline,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-xs)', alignItems: 'end' }}>
          <Select
            label="Course Link"
            name="courseId"
            required
            options={courseOptions}
            error={errors.courseId?.message}
            {...register('courseId', { required: 'Required' })}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateCourseOpen(true)}
            style={{ height: '42px', padding: '0 var(--space-sm)', minWidth: '42px', fontWeight: 'var(--font-black)', fontSize: 'var(--text-md)', border: 'var(--border-width) solid var(--border-color)', boxShadow: 'var(--shadow-offset)', cursor: 'pointer' }}
            title="Create New Course"
          >
            +
          </Button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-xs)', alignItems: 'end' }}>
          <Select
            label="Topic Link"
            name="topicId"
            required
            options={topicOptions}
            error={errors.topicId?.message}
            {...register('topicId', { required: 'Required' })}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCreateTopicOpen(true)}
            style={{ height: '42px', padding: '0 var(--space-sm)', minWidth: '42px', fontWeight: 'var(--font-black)', fontSize: 'var(--text-md)', border: 'var(--border-width) solid var(--border-color)', boxShadow: 'var(--shadow-offset)', cursor: 'pointer' }}
            title="Create New Topic"
          >
            +
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-md)' }}>
        <Input
          label="Lecture Title"
          name="title"
          required
          error={errors.title?.message}
          {...register('title', { required: 'Required' })}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <Input
          label="Session Date"
          name="sessionDateAndTime"
          type="date"
          required
          error={errors.sessionDateAndTime?.message}
          {...register('sessionDateAndTime', {
            required: 'Required',
            validate: (v) => {
              const d = new Date(v);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (d < today) return 'Must be a future date';
              return true;
            }
          })}
        />
        <Input
          label="Google Meet URL"
          name="meetUrl"
          required
          type="url"
          placeholder="https://meet.google.com/..."
          error={errors.meetUrl?.message}
          {...register('meetUrl', {
            required: 'Required',
            pattern: {
              value: /^https:\/\/[a-z0-9]+\..+$/,
              message: 'Must be a valid URL'
            }
          })}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 'var(--space-sm)' }}>
        <Input
          label="Start Time"
          name="startTime"
          type="time"
          required
          error={errors.startTime?.message}
          {...register('startTime', { required: 'Required' })}
        />
        <Input
          label="Half-1 End (Break)"
          name="half1EndTime"
          type="time"
          required
          hint="Attendance break marker"
          error={errors.half1EndTime?.message}
          {...register('half1EndTime', { required: 'Required' })}
        />
        <Input
          label="End Time"
          name="endTime"
          type="time"
          required
          error={errors.endTime?.message}
          {...register('endTime', { required: 'Required' })}
        />
        <Input
          label="Duration"
          name="duration"
          disabled
          {...register('duration')}
        />
      </div>

      <hr style={{ border: 'none', borderTop: '2px solid var(--color-neutral)', margin: 'var(--space-xs) 0' }} />
      <h4 style={{ fontWeight: 'var(--font-black)', fontSize: 'var(--text-sm)' }}>Linked Git Task Assignment</h4>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
        <Input
          label="Assignment Title"
          name="assignmentTitle"
          required
          error={errors.assignmentTitle?.message}
          {...register('assignmentTitle', { required: 'Required' })}
        />
        <Input
          label="Git Repo Template / Seed (Optional)"
          name="githubRepoSeed"
          type="url"
          placeholder="https://github.com/..."
          error={errors.githubRepoSeed?.message}
          {...register('githubRepoSeed')}
        />
      </div>

      <Textarea
        label="Assignment Brief / Prompt"
        name="assignmentDescription"
        required
        placeholder="Provide instructions for the code task..."
        error={errors.assignmentDescription?.message}
        {...register('assignmentDescription', { required: 'Required' })}
      />

      <Input
        label="Submission Deadline (Min 1 hour after lecture end)"
        name="assignmentDeadline"
        type="datetime-local"
        required
        error={errors.assignmentDeadline?.message}
        {...register('assignmentDeadline', {
          required: 'Required',
          validate: (value) => {
            if (!sessionDateAndTime || !endTime || !value) return true;
            
            const [endH, endM] = endTime.split(':').map(Number);
            const sessionEnd = new Date(`${sessionDateAndTime}T${endTime}:00`);
            
            // Calculate minimum allowed deadline (session end + 1 hour)
            const minDeadline = new Date(sessionEnd.getTime() + 60 * 60 * 1000);
            const inputDeadline = new Date(value);

            if (inputDeadline < minDeadline) {
              return 'Deadline must be at least 1 hour after the lecture end time';
            }
            return true;
          }
        })}
      />

      <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-md)' }}>
        <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">
          {defaultValues ? 'Update' : 'Schedule'} Lecture
        </Button>
      </div>

      {/* Create Course Modal */}
      <Modal isOpen={isCreateCourseOpen} onClose={() => setIsCreateCourseOpen(false)} title="Create New Course">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
          <Input
            label="Course Name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            placeholder="e.g. Node.js Advanced Routing"
            required
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
            <Button variant="ghost" onClick={() => { setIsCreateCourseOpen(false); setNewCourseName(''); }}>Cancel</Button>
            <Button
              variant="primary"
              disabled={isCreating || !newCourseName.trim()}
              onClick={handleCreateCourse}
            >
              {isCreating ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Topic Modal */}
      <Modal isOpen={isCreateTopicOpen} onClose={() => setIsCreateTopicOpen(false)} title="Create New Topic">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', padding: 'var(--space-sm) 0' }}>
          <Input
            label="Topic Name"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
            placeholder="e.g. Introduction to Express"
            required
          />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
            <Button variant="ghost" onClick={() => { setIsCreateTopicOpen(false); setNewTopicName(''); }}>Cancel</Button>
            <Button
              variant="primary"
              disabled={isCreatingTopic || !newTopicName.trim()}
              onClick={handleCreateTopic}
            >
              {isCreatingTopic ? 'Creating...' : 'Create Topic'}
            </Button>
          </div>
        </div>
      </Modal>
    </form>
  );
}
