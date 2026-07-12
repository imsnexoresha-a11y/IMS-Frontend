import Button from './Button';
import { Download } from 'lucide-react';
import { TEMPLATE_CONFIGS, generateAndDownloadJSON } from '../../utils/jsonTemplates';

/**
 * Reusable button for downloading structured JSON templates.
 * Uses the existing Button component to preserve Neobrutalist design guidelines.
 */
export default function TemplateDownloadButton({
  templateKey,
  variant = 'secondary',
  size = 'sm',
  label,
  children,
  ...props
}) {
  const config = TEMPLATE_CONFIGS[templateKey];

  const handleDownload = () => {
    if (config) {
      generateAndDownloadJSON(config);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={!config}
      {...props}
    >
      {children || (
        <>
          <Download size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />
          {label || 'Download Template'}
        </>
      )}
    </Button>
  );
}
