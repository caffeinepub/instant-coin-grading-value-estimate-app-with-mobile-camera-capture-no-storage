import { Card, CardContent } from '../ui/card';
import type { CoinMetadata } from '../../types/coin';

interface SubmittedMetadataSummaryProps {
  metadata: CoinMetadata;
}

export function SubmittedMetadataSummary({ metadata }: SubmittedMetadataSummaryProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <p className="text-sm font-medium mb-3">Submitted Details</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Country</p>
            <p className="font-medium">{metadata.country}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Year</p>
            <p className="font-medium">{metadata.year}</p>
          </div>
          <div className="col-span-2">
            <p className="text-muted-foreground">Denomination</p>
            <p className="font-medium">{metadata.denomination}</p>
          </div>
          {metadata.mintMark && (
            <div>
              <p className="text-muted-foreground">Mint Mark</p>
              <p className="font-medium">{metadata.mintMark}</p>
            </div>
          )}
          {metadata.notes && (
            <div className="col-span-2">
              <p className="text-muted-foreground">Notes</p>
              <p className="font-medium text-xs">{metadata.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
