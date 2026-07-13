import { useMemo, useState } from 'react';
import {
    CheckCircle,
    Download,
    Pencil,
    Upload,
} from 'lucide-react';

import Badge from '../../common/Badge';
import Button from '../../common/Button';
import DataTable from '../../common/DataTable';
import FileUpload from '../../common/FileUpload';
import Modal from '../../common/Modal';
import Select from '../../common/Select';

import { CSV_ACCEPT } from '../../../utils/constants';
import { downloadCSVTemplate } from '../../../utils/downloadTemplate';
import {
    mockAttendance,
    mockStudents,
} from '../../../api/mockData';

const STATUS_VARIANTS = {
    present: 'success',
    half: 'warning',
    absent: 'error',
};

const STATUS_POINTS = {
    present: 2.5,
    half: 1,
    absent: -5,
};

const ATTENDANCE_TEMPLATE_HEADERS = [
    'studentId',
    'lectureId',
    'firstHalf',
    'secondHalf',
    'status',
];

const ATTENDANCE_TEMPLATE_ROWS = [
    {
        studentId: 'student-001',
        lectureId: 'lec-001',
        firstHalf: 'present',
        secondHalf: 'present',
        status: 'present',
    },
    {
        studentId: 'student-002',
        lectureId: 'lec-001',
        firstHalf: 'present',
        secondHalf: 'absent',
        status: 'half',
    },
    {
        studentId: 'student-003',
        lectureId: 'lec-001',
        firstHalf: 'absent',
        secondHalf: 'absent',
        status: 'absent',
    },
];

export default function AdminAttendancePanel({
    batchId,
    lectures = [],
}) {
    const [records, setRecords] = useState(
        mockAttendance.map((record) => {
            const normalizedStatus =
                record.status === 'late' ? 'half' : record.status;

            return {
                ...record,
                status: normalizedStatus,
                firstHalf: normalizedStatus !== 'absent',
                secondHalf: normalizedStatus === 'present',
                marksApplied: STATUS_POINTS[normalizedStatus] ?? 0,
            };
        })
    );

    const [selectedLectureId, setSelectedLectureId] = useState(
        lectures[0]?.id || ''
    );

    const [editingRecord, setEditingRecord] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [templateMessage, setTemplateMessage] = useState('');

    const lectureOptions = lectures.map((lecture) => ({
        value: lecture.id,
        label: lecture.title,
    }));

    const visibleRecords = useMemo(() => {
        if (!selectedLectureId) {
            return records;
        }

        const filteredRecords = records.filter(
            (record) => record.lectureId === selectedLectureId
        );

        return filteredRecords.length > 0
            ? filteredRecords
            : records;
    }, [records, selectedLectureId]);

    const handleDownloadTemplate = () => {
        downloadCSVTemplate({
            filename: 'template_attendance.csv',
            headers: ATTENDANCE_TEMPLATE_HEADERS,
            exampleRows: ATTENDANCE_TEMPLATE_ROWS,
        });

        setTemplateMessage('Attendance template downloaded successfully.');
    };

    const updateAttendance = (status) => {
        if (!editingRecord) {
            return;
        }

        setRecords((currentRecords) =>
            currentRecords.map((record) =>
                record.studentId === editingRecord.studentId &&
                    record.lectureId === editingRecord.lectureId
                    ? {
                        ...record,
                        status,
                        firstHalf:
                            status === 'present' || status === 'half',
                        secondHalf: status === 'present',
                        marksApplied: STATUS_POINTS[status],
                    }
                    : record
            )
        );

        setEditingRecord(null);
    };

    const handleUpload = (file) => {
        if (!file) {
            setUploadMessage('');
            return;
        }

        setUploadMessage(
            `${file.name} selected. Attendance will be processed after backend integration.`
        );
    };

    const columns = [
        {
            key: 'studentName',
            label: 'Student',
            render: (value, row) => (
                <div>
                    <strong>{value}</strong>

                    <div
                        style={{
                            marginTop: '2px',
                            color: 'var(--color-text-secondary)',
                            fontSize: 'var(--text-xs)',
                        }}
                    >
                        {mockStudents.find(
                            (student) => student.id === row.studentId
                        )?.email || row.studentId}
                    </div>
                </div>
            ),
        },
        {
            key: 'firstHalf',
            label: 'First Half',
            render: (value) => (
                <Badge variant={value ? 'success' : 'error'}>
                    {value ? 'Present' : 'Absent'}
                </Badge>
            ),
        },
        {
            key: 'secondHalf',
            label: 'Second Half',
            render: (value) => (
                <Badge variant={value ? 'success' : 'error'}>
                    {value ? 'Present' : 'Absent'}
                </Badge>
            ),
        },
        {
            key: 'status',
            label: 'Final Status',
            render: (value) => (
                <Badge
                    variant={STATUS_VARIANTS[value] || 'neutral'}
                    dot
                >
                    {value}
                </Badge>
            ),
        },
        {
            key: 'marksApplied',
            label: 'Points',
            render: (value) => (
                <strong
                    style={{
                        color:
                            value < 0
                                ? 'var(--color-danger)'
                                : 'var(--color-success)',
                    }}
                >
                    {value > 0 ? '+' : ''}
                    {value}
                </strong>
            ),
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingRecord(row)}
                >
                    <Pencil size={14} />
                    Correct
                </Button>
            ),
        },
    ];

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-lg)',
                }}
            >
                <div>
                    <h3
                        style={{
                            fontSize: 'var(--text-lg)',
                            fontWeight: 'var(--font-bold)',
                        }}
                    >
                        Attendance Management
                    </h3>

                    <p
                        style={{
                            marginTop: '4px',
                            color: 'var(--color-text-secondary)',
                        }}
                    >
                        Review extension-generated attendance, import CSV records, and
                        correct attendance when required.
                    </p>
                </div>

                <div>
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleDownloadTemplate}
                    >
                        <Download size={16} />
                        Download Attendance Template
                    </Button>
                </div>

                {templateMessage && (
                    <Badge variant="success">
                        <CheckCircle size={14} />
                        {templateMessage}
                    </Badge>
                )}

                <div
                    style={{
                        padding: 'var(--space-sm) var(--space-md)',
                        border: '2px solid var(--border-color)',
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--text-xs)',
                        lineHeight: 1.6,
                    }}
                >
                    Required columns:
                    <br />
                    <strong>
                        studentId, lectureId, firstHalf, secondHalf, status
                    </strong>
                    <br />
                    Status values: <strong>present, half, absent</strong>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(240px, 360px) 1fr',
                        gap: 'var(--space-lg)',
                        alignItems: 'end',
                    }}
                >
                    <Select
                        label="Lecture"
                        name="attendanceLecture"
                        value={selectedLectureId}
                        options={[
                            {
                                value: '',
                                label: 'All lectures',
                            },
                            ...lectureOptions,
                        ]}
                        onChange={(event) =>
                            setSelectedLectureId(event.target.value)
                        }
                    />

                    <FileUpload
                        label="Import Attendance CSV"
                        accept={CSV_ACCEPT}
                        onFileSelect={handleUpload}
                    />
                </div>

                {uploadMessage && (
                    <Badge variant="info">
                        <Upload size={14} />
                        {uploadMessage}
                    </Badge>
                )}

                <DataTable
                    columns={columns}
                    data={visibleRecords}
                    searchPlaceholder="Search attendance..."
                />
            </div>

            <Modal
                isOpen={Boolean(editingRecord)}
                onClose={() => setEditingRecord(null)}
                title="Correct Attendance"
                size="sm"
            >
                {editingRecord && (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--space-md)',
                        }}
                    >
                        <div>
                            <strong>{editingRecord.studentName}</strong>

                            <p
                                style={{
                                    marginTop: '4px',
                                    color: 'var(--color-text-secondary)',
                                }}
                            >
                                Select the corrected attendance status.
                            </p>
                        </div>

                        {['present', 'half', 'absent'].map((status) => (
                            <Button
                                key={status}
                                type="button"
                                variant={
                                    editingRecord.status === status
                                        ? 'primary'
                                        : 'secondary'
                                }
                                onClick={() => updateAttendance(status)}
                            >
                                <CheckCircle size={15} />
                                Mark {status}
                            </Button>
                        ))}

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setEditingRecord(null)}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </Modal>
        </>
    );
}