import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Check,
  Copy,
  ExternalLink,
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

  const [copiedBatchId, setCopiedBatchId] =
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
          String(getBatchId(batch)) ===
          String(selectedBatchId)
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

  const selectedBatchAlreadyLinked =
    Boolean(
      selectedBatch &&
      getRecruiterUuid(selectedBatch)
    );

  const handleGenerateSelected = () => {
    if (
      !selectedBatch ||
      selectedBatchAlreadyLinked
    ) {
      return;
    }

    onGenerate?.(selectedBatch);
  };

  const copyLink = async (batch) => {
    const url = getRecruiterUrl(batch);
    const batchId = getBatchId(batch);

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

    setCopiedBatchId(batchId);

    window.setTimeout(() => {
      setCopiedBatchId('');
    }, 2000);
  };

  const openRecruiterPage = (batch) => {
    const url = getRecruiterUrl(batch);

    if (!url) {
      return;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Card
      title="Recruiter Links"
      headerAction={
        selectedBatchAlreadyLinked ? (
          <Badge variant="success" dot>
            Link Active
          </Badge>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleGenerateSelected}
            disabled={
              !selectedBatchId ||
              Boolean(generatingBatchId)
            }
            title="Generate recruiter link"
          >
            <Plus size={16} />
            {generatingBatchId ? 'Generating...' : 'Generate Link'}
          </Button>
        )
      }
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)',
        }}
      >
        {batches.length === 0 ? (
          <p
            style={{
              color: 'var(--color-text-secondary)',
            }}
          >
            No batches available.
          </p>
        ) : (
          batches.map((batch) => {
            const batchId = getBatchId(batch);
            const uuid = getRecruiterUuid(batch);
            const recruiterUrl = getRecruiterUrl(batch);
            const createdAt = getCreatedAt(batch);
            const viewCount = getViewCount(batch);
            const isGenerating = String(generatingBatchId) === String(batchId);
            const isRevoking = String(revokingBatchId) === String(batchId);
            const isCopied = String(copiedBatchId) === String(batchId);
            const hasLink = Boolean(uuid);

            return (
              <div
                key={batchId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-md)',
                  padding: 'var(--space-sm) var(--space-md)',
                  border: '2px solid var(--color-neutral)',
                  backgroundColor: hasLink ? 'var(--color-surface)' : 'var(--color-bg)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', color: hasLink ? 'var(--color-accent)' : 'var(--color-text-secondary)' }}>
                  <Link2 size={18} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 'var(--font-bold)', fontSize: 'var(--text-sm)' }}>
                    {batch.name || batch.batchName || 'Unnamed Batch'}
                  </div>

                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    {hasLink ? (
                      <>
                        {createdAt ? `Created ${formatDate(createdAt)}` : 'Link active'} · {viewCount} views
                      </>
                    ) : (
                      'No recruiter link generated yet'
                    )}
                  </div>

                  {hasLink && recruiterUrl && (
                    <div
                      title={recruiterUrl}
                      style={{
                        marginTop: 'var(--space-xs)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-accent)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {recruiterUrl}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
                  {!hasLink ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => onGenerate?.(batch)}
                      disabled={isGenerating}
                    >
                      <Plus size={14} />
                      {isGenerating ? 'Generating...' : 'Generate Link'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => copyLink(batch)}
                        title={isCopied ? 'Copied' : 'Copy link'}
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        {isCopied ? 'Copied' : 'Copy'}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openRecruiterPage(batch)}
                        title="Open recruiter page"
                      >
                        <ExternalLink size={14} />
                        View
                      </Button>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => onRevoke?.(batch)}
                        disabled={isRevoking}
                        title="Revoke link"
                      >
                        <Trash2 size={14} />
                        {isRevoking ? 'Revoking...' : 'Revoke'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}