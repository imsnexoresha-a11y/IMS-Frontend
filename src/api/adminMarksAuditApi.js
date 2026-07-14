import apiClient from './apiClient';

function cleanText(value) {
    return typeof value === 'string'
        ? value.trim()
        : value;
}

function removeEmptyParams(params = {}) {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) =>
                value !== undefined &&
                value !== null &&
                value !== ''
        )
    );
}

/*
 * Backend audit enums are uppercase:
 * MARK_OVERRIDE, EVENT_CORRECTION, MANUAL_SCORE, etc.
 */
function normalizeActionType(value) {
    if (!value) {
        return undefined;
    }

    return String(value)
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '_')
        .replace(/-/g, '_');
}

function normalizeAuditParams(params = {}) {
    const normalized = {
        ...params,
        actionType: normalizeActionType(
            params.actionType
        ),
    };

    if (params.from) {
        normalized.from = new Date(
            `${params.from}T00:00:00.000`
        ).toISOString();
    }

    if (params.to) {
        normalized.to = new Date(
            `${params.to}T23:59:59.999`
        ).toISOString();
    }

    return removeEmptyParams(normalized);
}

function normalizeAuditLog(log) {
    return {
        ...log,

        id: log?._id || log?.id,

        createdAt:
            log?.createdAt ||
            log?.timestamp ||
            null,

        actionType:
            log?.actionType ||
            log?.action ||
            'UNKNOWN',

        entityType:
            log?.entityType ||
            log?.targetType ||
            '—',

        entityId:
            log?.entityId ||
            log?.targetId ||
            null,

        adminId:
            log?.adminId?._id ||
            log?.adminId?.id ||
            log?.adminId ||
            null,

        reason:
            log?.reason ||
            log?.details ||
            '—',

        oldValue:
            log?.oldValue ?? null,

        newValue:
            log?.newValue ?? null,
    };
}

function normalizeAuditResponse(result) {
    const logs = Array.isArray(result)
        ? result
        : result?.logs || [];

    return {
        logs: logs.map(normalizeAuditLog),

        pagination:
            result?.pagination || {
                page: 1,
                limit: logs.length || 20,
                total: logs.length,
                totalPages: 1,
            },

        exportedAt:
            result?.exportedAt || null,

        count:
            result?.count ?? logs.length,
    };
}

/*
|--------------------------------------------------------------------------
| Marks Administration
|--------------------------------------------------------------------------
*/

export async function createMarkOverride(data) {
    return apiClient.post(
        '/admin/marks/override',
        {
            studentId: data.studentId,
            delta: Number(data.delta),
            reason: cleanText(data.reason),
        }
    );
}

export async function correctLedgerEvent(data) {
    return apiClient.post(
        '/admin/marks/event-correction',
        {
            ledgerEventId:
                cleanText(data.ledgerEventId),

            newMark:
                Number(data.newMark),

            reason:
                cleanText(data.reason),
        }
    );
}

export async function createManualScore(data) {
    return apiClient.post(
        '/admin/marks/manual-score',
        {
            studentId:
                data.studentId,

            submissionId:
                cleanText(data.submissionId),

            manualScore:
                Number(data.manualScore),

            reason:
                cleanText(data.reason),
        }
    );
}

export async function recalculateStudent(
    studentId,
    reason
) {
    if (!studentId) {
        throw new Error(
            'Student ID is required.'
        );
    }

    return apiClient.post(
        `/admin/marks/recalculate/${studentId}`,
        {
            reason: cleanText(reason),
        }
    );
}

export async function recalculateBatch(
    batchId,
    reason
) {
    if (!batchId) {
        throw new Error(
            'Batch ID is required.'
        );
    }

    return apiClient.post(
        `/admin/marks/recalculate-batch/${batchId}`,
        {
            reason: cleanText(reason),
        }
    );
}

export async function getMarkOverrides(
    params = {}
) {
    const result = await apiClient.get(
        '/admin/audit-log',
        {
            params: normalizeAuditParams({
                ...params,
                actionType: 'MARK_OVERRIDE',
            }),
        }
    );

    const normalized =
        normalizeAuditResponse(result);

    const items = normalized.logs.map(
        (log) => ({
            id: log.id,

            studentId:
                log.entityId || '',

            studentName:
                log.newValue?.studentName ||
                log.oldValue?.studentName ||
                log.entityId ||
                'Unknown student',

            category:
                log.newValue?.category ||
                'override',

            previousValue:
                log.oldValue?.totalScore ??
                log.oldValue?.marks ??
                '—',

            newValue:
                log.newValue?.totalScore ??
                log.newValue?.marks ??
                log.newValue?.delta ??
                '—',

            reason:
                log.reason,

            adminId:
                log.adminId || 'system',

            adminName:
                log.newValue?.adminName ||
                log.adminId ||
                'Admin',

            createdAt:
                log.createdAt,
        })
    );

    return {
        items,
        pagination:
            normalized.pagination,
    };
}

/*
|--------------------------------------------------------------------------
| Audit Log
|--------------------------------------------------------------------------
*/

export async function getAuditLog(
    params = {}
) {
    const result = await apiClient.get(
        '/admin/audit-log',
        {
            params:
                normalizeAuditParams(params),
        }
    );

    return normalizeAuditResponse(result);
}

export async function exportAuditLog(
    params = {}
) {
    const result = await apiClient.get(
        '/admin/audit-log/export',
        {
            params:
                normalizeAuditParams(params),
        }
    );

    return normalizeAuditResponse(result);
}