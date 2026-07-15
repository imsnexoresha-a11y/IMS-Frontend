import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Copy,
  Link2,
  Plus,
  Trash2,
} from 'lucide-react';

import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Select from '../common/Select';
import { formatDate } from '../../utils/formatters';

function getBatchId(batch) {
  return batch?._id || batch?.id || '';
}

function getRecruiterUuid(batch) {
  return (
    batch?.recruiterUuid ||
    batch?.recruiterUUID ||
    batch?.recruiterLink?.uuid ||
    batch?.recruiterLink?.recruiterUuid ||
    ''
  );
}

function getRecruiterUrl(batch) {
  const uuid = getRecruiterUuid(batch);

  return (
    batch?.recruiterUrl ||
    batch?.recruiterLink?.url ||
    (uuid
      ? `${window.location.origin}/recruiter/${uuid}`
      : '')
  );
}

function getCreatedAt(batch) {
  return (
    batch?.recruiterLinkCreatedAt ||
    batch?.recruiterLink?.createdAt ||
    batch?.updatedAt ||
    batch?.createdAt ||
    null
  );
}

function getViewCount(batch) {
  return (
    batch?.recruiterAccessCount ??
    batch?.recruiterViews ??
    batch?.recruiterLink?.accessCount ??
    0
  );
}

export default function RecruiterLinkManager({
  batches = [],
  onGenerate,
  onRevoke,
  generatingBatchId = '',
  revokingBatchId = '',
}) {
  const [selectedBatchId, setSelectedBatchId] =
    useState('');

  const batchOptions = useMemo(
    () =>
      batches
        .map((batch) => ({
          value: getBatchId(batch),
          label:
            batch.name ||
            batch.batchName ||
            'Unnamed Batch',
        }))
        .filter((option) => option.value),
    [batches]
  );

  useEffect(() => {
    if (
      !selectedBatchId &&
      batchOptions.length > 0
    ) {
      setSelectedBatchId(
        batchOptions[0].value
      );
      return;
    }

    const selectedStillExists =
      batchOptions.some(
        (option) =>
          option.value === selectedBatchId
      );

    if (
      selectedBatchId &&
      !selectedStillExists
    ) {
      setSelectedBatchId(
        batchOptions[0]?.value || ''
      );
    }
  }, [batchOptions, selectedBatchId]);

  const selectedBatch = useMemo(
    () =>
      batches.find(
        (batch) =>
          getBatchId(batch) ===
          selectedBatchId
      ) || null,
    [batches, selectedBatchId]
  );

  const linkedBatches = useMemo(
    () =>
      batches.filter((batch) =>
        Boolean(getRecruiterUuid(batch))
      ),
    [batches]
  );

  const handleGenerateSelected = () => {
    if (!selectedBatch) {
      return;
    }

    onGenerate?.(selectedBatch);
  };

  const copyLink = async (batch) => {
    const url = getRecruiterUrl(batch);

    if (!url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        url
      );
    } catch {
      const textarea =
        document.createElement('textarea');

      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';

      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
  };

  return (
    <Card
      title="Recruiter Links"
      headerAction={
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleGenerateSelected}
          disabled={
            !selectedBatchId ||
            Boolean(generatingBatchId)
          }
        >
          <Plus size={16} />

          {generatingBatchId
            ? 'Generating...'
            : 'Generate Link'}
        </Button>
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
          }}
        >
          <Select
            label="Select Batch"
            name="recruiterBatchId"
            value={selectedBatchId}
            options={[
              {
                value: '',
                label: 'Select a batch',
              },
              ...batchOptions,
            ]}
            onChange={(event) =>
              setSelectedBatchId(
                event.target.value
              )
            }
          />
        </div>

        {linkedBatches.length === 0 ? (
          <p
            style={{
              color:
                'var(--color-text-secondary)',
            }}
          >
            No active recruiter links have
            been generated.
          </p>
        ) : (
          linkedBatches.map((batch) => {
            const batchId =
              getBatchId(batch);

            const createdAt =
              getCreatedAt(batch);

            const viewCount =
              getViewCount(batch);

            const isGenerating =
              generatingBatchId ===
              batchId;

            const isRevoking =
              revokingBatchId === batchId;

            return (
              <div
                key={batchId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding:
                    'var(--space-sm) var(--space-md)',
                  border:
                    '2px solid var(--color-neutral)',
                }}
              >
                <Link2
                  size={18}
                  style={{
                    color:
                      'var(--color-accent)',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight:
                        'var(--font-bold)',
                      fontSize:
                        'var(--text-sm)',
                    }}
                  >
                    {batch.name ||
                      batch.batchName ||
                      'Unnamed Batch'}
                  </div>

                  <div
                    style={{
                      fontSize:
                        'var(--text-xs)',
                      color:
                        'var(--color-text-secondary)',
                    }}
                  >
                    {createdAt
                      ? `Created ${formatDate(
                        createdAt
                      )}`
                      : 'Recruiter link active'}

                    {' · '}

                    {viewCount} views
                  </div>
                </div>

                <Badge
                  variant="success"
                  dot
                >
                  Active
                </Badge>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyLink(batch)
                  }
                  disabled={
                    isGenerating ||
                    isRevoking
                  }
                  aria-label={`Copy recruiter link for ${batch.name ||
                    'batch'
                    }`}
                >
                  <Copy size={14} />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    onRevoke?.(batch)
                  }
                  disabled={
                    isGenerating ||
                    isRevoking
                  }
                  aria-label={`Revoke recruiter link for ${batch.name ||
                    'batch'
                    }`}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}