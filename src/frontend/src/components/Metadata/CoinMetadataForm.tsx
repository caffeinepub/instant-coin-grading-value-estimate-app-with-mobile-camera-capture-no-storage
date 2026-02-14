import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import type { CoinMetadata } from '../../types/coin';

interface CoinMetadataFormProps {
  onSubmit: (metadata: CoinMetadata) => void;
  onBack: () => void;
  flowError?: string | null;
  onClearError?: () => void;
  onReturnToCapture?: () => void;
}

export function CoinMetadataForm({
  onSubmit,
  onBack,
  flowError,
  onClearError,
  onReturnToCapture,
}: CoinMetadataFormProps) {
  const [formData, setFormData] = useState<CoinMetadata>({
    country: '',
    denomination: '',
    year: '',
    mintMark: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CoinMetadata, string>>>({});

  const handleChange = (field: keyof CoinMetadata, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (flowError && onClearError) {
      onClearError();
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CoinMetadata, string>> = {};

    if (!formData.country.trim()) {
      newErrors.country = 'Country/region is required';
    }
    if (!formData.denomination.trim()) {
      newErrors.denomination = 'Denomination is required';
    }
    if (!formData.year.trim()) {
      newErrors.year = 'Year is required';
    } else if (!/^\d{4}$/.test(formData.year)) {
      newErrors.year = 'Please enter a valid 4-digit year';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coin Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {flowError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-start justify-between gap-2">
                <span>{flowError}</span>
                {onReturnToCapture && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onReturnToCapture}
                    className="shrink-0"
                  >
                    Go Back
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="country">Country/Region *</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder="e.g., United States"
              className={errors.country ? 'border-destructive' : ''}
            />
            {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="denomination">Denomination *</Label>
            <Input
              id="denomination"
              value={formData.denomination}
              onChange={(e) => handleChange('denomination', e.target.value)}
              placeholder="e.g., Indian Head Penny"
              className={errors.denomination ? 'border-destructive' : ''}
            />
            {errors.denomination && (
              <p className="text-sm text-destructive">{errors.denomination}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="year">Year *</Label>
            <Input
              id="year"
              value={formData.year}
              onChange={(e) => handleChange('year', e.target.value)}
              placeholder="e.g., 1909"
              maxLength={4}
              className={errors.year ? 'border-destructive' : ''}
            />
            {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mintMark">Mint Mark (Optional)</Label>
            <Input
              id="mintMark"
              value={formData.mintMark}
              onChange={(e) => handleChange('mintMark', e.target.value)}
              placeholder="e.g., S, D, P"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Any additional details about the coin..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button type="submit" className="flex-1">
              Analyze
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
