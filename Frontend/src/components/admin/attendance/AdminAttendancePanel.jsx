import { useMemo, useState } from 'react';
import { ClipboardCheck } from 'lucide-react';

import Button from '../../common/Button';
import Badge from '../../common/Badge';
import DataTable from '../../common/DataTable';
import FileUpload from '../../common/FileUpload';
import Select from '../../common/Select';

import { CSV_ACCEPT } from '../../../utils/constants';


export default function AdminAttendancePanel({
    batchId,
    lectures = [],
}) {
    const [selectedLecture, setSelectedLecture] = useState('');
    const [message, setMessage] = useState('');

    const lectureOptions = [
        { value: '', label: 'Select Lecture' },
        ...(lectures.length ? lectures : [])
            .filter((l) => !batchId || l.batchId === batchId)
            .map((l) => ({
                value: l.id,
                label: l.title,
            })),
    ];

    const attendance = useMemo(() => {
        if (!selectedLecture) return [];

        return [].filter(
            (row) => row.lectureId === selectedLecture
        );
    }, [selectedLecture]);

    const columns = [
        {
            key: 'studentName',
            label: 'Student',
        },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <Badge
                    variant={
                        value === 'present'
                            ? 'success'
                            : value === 'late'
                                ? 'warning'
                                : 'error'
                    }
                    dot
                >
                    {value}
                </Badge>
            ),
        },
    ];

    return (
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        fontSize: 'var(--text-lg)',
                        fontWeight: 'var(--font-bold)',
                    }}
                >
                    <ClipboardCheck size={20} />
                    Attendance Management
                </h3>

                <p
                    style={{
                        marginTop: 4,
                        color: 'var(--color-text-secondary)',
                    }}
                >
                    Upload attendance CSV and review attendance records.
                </p>
            </div>

            <div
                style={{
                    display: 'flex',
                    gap: 'var(--space-md)',
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                }}
            >
                <div style={{ width: 300 }}>
                    <Select
                        label="Lecture"
                        name="lecture"
                        value={selectedLecture}
                        options={lectureOptions}
                        onChange={(e) =>
                            setSelectedLecture(e.target.value)
                        }
                    />
                </div>

                <FileUpload
                    label="Upload Attendance CSV"
                    accept={CSV_ACCEPT}
                    onFileSelect={(file) => {
                        if (file) {
                            setMessage(`${file.name} selected.`);
                        }
                    }}
                />

                <Button variant="primary">
                    Process CSV
                </Button>
            </div>

            {message && (
                <Badge variant="info">
                    {message}
                </Badge>
            )}

            <DataTable
                columns={columns}
                data={attendance}
                searchPlaceholder="Search students..."
            />
        </div>
    );
}