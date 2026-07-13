/**
 * Shared configurations for JSON templates used across various upload screens.
 * Easily extensible for future upload workflows (e.g. teachers, batches, assignments).
 */
export const TEMPLATE_CONFIGS = {
  // JSON templates (for Teacher module)
  teacherAttendance: {
    format: 'json',
    filename: 'attendance-template.json',
    data: [
      {
        student_email: 'student@ims.dev',
        first_half: true,
        second_half: false,
      },
    ],
  },
  quiz: {
    format: 'json',
    filename: 'quiz-template.json',
    data: [
      {
        student_email: 'student@ims.dev',
        score: 4.5,
      },
    ],
  },
};

/**
 * Dynamically generates a formatted JSON string from configurations and triggers
 * a client-side download.
 * @param {Object} config The template configuration object
 */
export function generateAndDownloadJSON(config) {
  if (!config || !config.data) return;

  const jsonString = JSON.stringify(config.data, null, 2);
  const blob = new Blob([jsonString], {
    type: 'application/json;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = config.filename || 'template.json';

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}
