import { useState } from 'react';
import {
  CheckCircle,
  Download,
} from 'lucide-react';

import Modal from '../common/Modal';
import FileUpload from '../common/FileUpload';
import Button from '../common/Button';
import Badge from '../common/Badge';

import { CSV_ACCEPT } from '../../utils/constants';
import { downloadCSVTemplate } from '../../utils/downloadTemplate';

const STUDENT_TEMPLATE_HEADERS = [
  'name',
  'email',
  'password',
  'mobileNo',
  'enrollementNo',
  'dob',
  'educationQualification',
  'gender',
  'instituteName',
  'batchId',
];

const STUDENT_TEMPLATE_ROWS = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    password: 'Student@123',
    mobileNo: '9876543210',
    enrollementNo: 'IMS2026001',
    dob: '2005-08-14',
    educationQualification:
      'Diploma in Information Technology',
    gender: 'Male',
    instituteName:
      'Example Institute of Technology',
    batchId: '',
  },
];

function parseCSVLine(line) {
  const values = [];
  let currentValue = '';
  let insideQuotes = false;

  for (
    let index = 0;
    index < line.length;
    index += 1
  ) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (
      character === '"' &&
      insideQuotes &&
      nextCharacter === '"'
    ) {
      currentValue += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (
      character === ',' &&
      !insideQuotes
    ) {
      values.push(currentValue.trim());
      currentValue = '';
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());

  return values;
}

function parseStudentCSV(text) {
  const normalizedText = text
    .replace(/^\uFEFF/, '')
    .trim();

  if (!normalizedText) {
    throw new Error('The CSV file is empty.');
  }

  const lines = normalizedText
    .split(/\r?\n/)
    .filter((line) => line.trim());

  if (lines.length < 2) {
    throw new Error(
      'The CSV must contain a header and at least one student.'
    );
  }

  const headers = parseCSVLine(lines[0]);

  const missingHeaders =
    STUDENT_TEMPLATE_HEADERS.filter(
      (header) => !headers.includes(header)
    );

  if (missingHeaders.length > 0) {
    throw new Error(
      `Missing CSV columns: ${missingHeaders.join(
        ', '
      )}`
    );
  }

  return lines.slice(1).map((line, rowIndex) => {
    const values = parseCSVLine(line);

    const record = headers.reduce(
      (result, header, index) => ({
        ...result,
        [header]: values[index]?.trim() || '',
      }),
      {}
    );

    const requiredFields = [
      'name',
      'email',
      'password',
      'mobileNo',
      'enrollementNo',
      'dob',
      'gender',
      'instituteName',
    ];

    const missingValues =
      requiredFields.filter(
        (field) => !record[field]
      );

    if (missingValues.length > 0) {
      throw new Error(
        `Row ${rowIndex + 2
        } is missing: ${missingValues.join(
          ', '
        )}`
      );
    }

    return {
      ...record,
      batchId: record.batchId || null,
    };
  });
}

export default function BulkUploadCSVModal({
  isOpen,
  onClose,
  onUpload,
  isUploading = false,
}) {
  const [
    selectedFile,
    setSelectedFile,
  ] = useState(null);

  const [
    templateMessage,
    setTemplateMessage,
  ] = useState('');

  const [errorMessage, setErrorMessage] =
    useState('');

  const handleFile = (file) => {
    setSelectedFile(file || null);
    setErrorMessage('');
  };

  const handleDownloadTemplate = () => {
    downloadCSVTemplate({
      filename: 'template_students.csv',
      headers: STUDENT_TEMPLATE_HEADERS,
      exampleRows: STUDENT_TEMPLATE_ROWS,
    });

    setTemplateMessage(
      'Student template downloaded successfully.'
    );
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setErrorMessage('');

    try {
      const fileText =
        await selectedFile.text();

      const students =
        parseStudentCSV(fileText);

      await onUpload?.(students);
    } catch (error) {
      setErrorMessage(
        error?.message ||
        'Unable to process the CSV file.'
      );
    }
  };

  const handleClose = () => {
    if (isUploading) {
      return;
    }

    setSelectedFile(null);
    setTemplateMessage('');
    setErrorMessage('');
    onClose?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Upload Students"
      size="md"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={
              !selectedFile ||
              isUploading
            }
            onClick={handleUpload}
          >
            {isUploading
              ? 'Uploading...'
              : 'Upload & Process'}
          </Button>
        </>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color:
              'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          Upload a CSV containing student
          records. Every student must have a
          temporary password because the backend
          creates a login account for each record.
        </p>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleDownloadTemplate}
        >
          <Download size={16} />
          Download Student Template
        </Button>

        {templateMessage && (
          <Badge variant="success">
            <CheckCircle size={14} />
            {templateMessage}
          </Badge>
        )}

        {errorMessage && (
          <div
            role="alert"
            style={{
              padding: 'var(--space-sm)',
              border:
                '2px solid var(--color-danger)',
              color: 'var(--color-danger)',
              fontSize: 'var(--text-sm)',
              fontWeight:
                'var(--font-bold)',
            }}
          >
            {errorMessage}
          </div>
        )}

        <div
          style={{
            padding:
              'var(--space-sm) var(--space-md)',
            border:
              '2px solid var(--border-color)',
            backgroundColor:
              'var(--color-bg)',
            fontSize: 'var(--text-xs)',
            color:
              'var(--color-text-secondary)',
            lineHeight: 1.6,
          }}
        >
          Required CSV columns:
          <br />
          <strong>
            name, email, password, mobileNo,
            enrollementNo, dob,
            educationQualification, gender,
            instituteName, batchId
          </strong>
        </div>

        <FileUpload
          label="Student CSV File"
          accept={CSV_ACCEPT}
          onFileSelect={handleFile}
        />

        {selectedFile && (
          <Badge variant="success">
            Selected: {selectedFile.name}
          </Badge>
        )}
      </div>
    </Modal>
  );
}