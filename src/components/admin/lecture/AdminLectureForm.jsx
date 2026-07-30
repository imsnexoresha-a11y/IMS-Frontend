import { useForm } from 'react-hook-form';
import Input from '../../common/Input';
import Textarea from '../../common/Textarea';
import Select from '../../common/Select';
import Button from '../../common/Button';

export default function AdminLectureForm({
    topics = [],
    defaultValues = null,
    onSubmit,
    onCancel,
    isSaving = false,
}) {
    const topicOptions = topics.map((topic) => ({
        value: topic.id,
        label: topic.title,
    }));

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: defaultValues || {
            title: '',
            topicId: '',
            date: '',
            startTime: '',
            endTime: '',
            half1EndTime: '',
            meetUrl: '',
            description: '',
        },
    });

    const submitForm = async (formData) => {
        await onSubmit?.({
            title: formData.title.trim(),
            topicId: formData.topicId,

            lectureDate:
                formData.lectureDate ||
                formData.date,

            startTime: formData.startTime,

            halfwayTime:
                formData.halfwayTime ||
                formData.half1EndTime,

            endTime: formData.endTime,

            meetUrl:
                formData.meetUrl.trim(),

            description:
                formData.description?.trim() ||
                '',
        });
    };

    const disabled = isSubmitting || isSaving;

    return (
        <form
            onSubmit={handleSubmit(submitForm)}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-md)',
            }}
        >
            <Input
                label="Lecture Title"
                {...register('title', {
                    required: 'Lecture title is required',
                })}
                error={errors.title?.message}
            />

            <Select
                label="Topic"
                options={[
                    { value: '', label: 'Select a topic' },
                    ...topicOptions,
                ]}
                {...register('topicId', {
                    required: 'Please select a topic',
                })}
                error={errors.topicId?.message}
            />

            <Input
                label="Lecture Date"
                type="date"
                {...register('date', {
                    required: 'Lecture date is required',
                })}
                error={errors.date?.message}
            />

            <Input
                label="Start Time"
                type="time"
                {...register('startTime', {
                    required: 'Start time is required',
                })}
                error={errors.startTime?.message}
            />

            <Input
                label="Halfway Time"
                type="time"
                {...register('half1EndTime', {
                    required: 'Halfway time is required',
                })}
                error={errors.half1EndTime?.message}
            />

            <Input
                label="End Time"
                type="time"
                {...register('endTime', {
                    required: 'End time is required',
                })}
                error={errors.endTime?.message}
            />

            <Input
                label="Google Meet URL"
                type="url"
                {...register('meetUrl', {
                    required: 'Google Meet URL is required',
                })}
                error={errors.meetUrl?.message}
            />

            <Textarea
                label="Description"
                rows={4}
                {...register('description')}
            />

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 'var(--space-sm)',
                }}
            >
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={disabled}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    disabled={disabled}
                >
                    {disabled
                        ? 'Saving...'
                        : defaultValues
                            ? 'Update Lecture'
                            : 'Schedule Lecture'}
                </Button>
            </div>
        </form>
    );
}