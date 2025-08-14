import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Camera, Upload, Loader2, Check, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';

export interface ParsedPantryItem {
  name: string;
  quantity?: number;
  unit?: string;
  confidence?: number;
}

interface PantryScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmItems: (items: ParsedPantryItem[]) => void;
  scanType?: 'receipt' | 'fridge';
}

/**
 * Modal for AI-powered pantry scanning from receipt or fridge photos
 * Handles image upload, processing, and item confirmation
 */
const PantryScanModal: React.FC<PantryScanModalProps> = ({
  isOpen,
  onClose,
  onConfirmItems,
  scanType = 'receipt'
}) => {
  const [step, setStep] = useState<'upload' | 'analyzing' | 'review'>('upload');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [parsedItems, setParsedItems] = useState<ParsedPantryItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<ParsedPantryItem>({ name: '', quantity: 0, unit: '' });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    const invalidFiles = files.filter(file => 
      !allowedTypes.includes(file.type) || file.size > maxFileSize
    );

    if (invalidFiles.length > 0) {
      setError('Please select only JPEG, PNG, or WebP images under 10MB each.');
      return;
    }

    if (files.length > 5) {
      setError('Maximum 5 images allowed per scan.');
      return;
    }

    setSelectedFiles(files);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image to analyze');
      return;
    }

    setStep('analyzing');

    try {
      // TODO: Replace with actual API call to parse-pantry endpoint
      // Simulating API response for now
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock parsed items based on scan type
      const mockItems: ParsedPantryItem[] = scanType === 'receipt' 
        ? [
            { name: 'Tomatoes', quantity: 1, unit: 'kg', confidence: 0.95 },
            { name: 'Chicken Breast', quantity: 500, unit: 'g', confidence: 0.92 },
            { name: 'Rice', quantity: 1, unit: 'kg', confidence: 0.88 },
            { name: 'Olive Oil', quantity: 1, unit: 'bottle', confidence: 0.85 },
            { name: 'Onions', quantity: 2, unit: 'kg', confidence: 0.90 }
          ]
        : [
            { name: 'Milk', quantity: 1, unit: 'L', confidence: 0.94 },
            { name: 'Eggs', quantity: 12, unit: 'pieces', confidence: 0.96 },
            { name: 'Carrots', quantity: 500, unit: 'g', confidence: 0.87 },
            { name: 'Cheese', quantity: 200, unit: 'g', confidence: 0.91 },
            { name: 'Bread', quantity: 1, unit: 'loaf', confidence: 0.89 }
          ];

      setParsedItems(mockItems);
      setStep('review');
      toast.success(`Found ${mockItems.length} items in your ${scanType}!`);
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast.error('Failed to analyze image. Please try again.');
      setStep('upload');
    }
  };

  const handleEditItem = (index: number) => {
    setEditingIndex(index);
    setEditValues({ ...parsedItems[index] });
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedItems = [...parsedItems];
      updatedItems[editingIndex] = editValues;
      setParsedItems(updatedItems);
      setEditingIndex(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditValues({ name: '', quantity: 0, unit: '' });
  };

  const handleRemoveItem = (index: number) => {
    setParsedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    onConfirmItems(parsedItems);
    handleReset();
    onClose();
    toast.success(`Added ${parsedItems.length} items to your pantry!`);
  };

  const handleReset = () => {
    setStep('upload');
    setSelectedFiles([]);
    setParsedItems([]);
    setEditingIndex(null);
    setEditValues({ name: '', quantity: 0, unit: '' });
  };

  const renderUploadStep = () => (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
          {scanType === 'receipt' ? <Upload className="h-6 w-6" /> : <Camera className="h-6 w-6" />}
        </div>
        <h3 className="text-lg font-medium mb-2">
          Upload {scanType === 'receipt' ? 'Receipt' : 'Fridge'} Photo
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {scanType === 'receipt' 
            ? 'Take a photo of your grocery receipt to automatically add items to your pantry'
            : 'Take a photo of your fridge contents to identify available ingredients'
          }
        </p>
        <Button onClick={() => fileInputRef.current?.click()}>
          Select Image
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm">{file.name}</span>
              <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)}MB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalyzingStep = () => (
    <div className="text-center py-8">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">Analyzing Images...</h3>
      <p className="text-sm text-muted-foreground">
        Our AI is identifying items in your {scanType}. This may take a moment.
      </p>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Found Items ({parsedItems.length})</h3>
        <Button variant="outline" size="sm" onClick={() => setStep('upload')}>
          Scan Another
        </Button>
      </div>
      
      <ScrollArea className="max-h-60">
        <div className="space-y-2">
          {parsedItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              {editingIndex === index ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    value={editValues.name}
                    onChange={(e) => setEditValues(prev => ({ ...prev, name: e.target.value }))}
                    className="flex-1"
                    placeholder="Item name"
                  />
                  <Input
                    type="number"
                    value={editValues.quantity || ''}
                    onChange={(e) => setEditValues(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                    className="w-20"
                    placeholder="Qty"
                  />
                  <Input
                    value={editValues.unit || ''}
                    onChange={(e) => setEditValues(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-16"
                    placeholder="Unit"
                  />
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} {item.unit}
                      {item.confidence && (
                        <span className="ml-2 text-xs">
                          ({Math.round(item.confidence * 100)}% confident)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEditItem(index)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRemoveItem(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Scan {scanType === 'receipt' ? 'Receipt' : 'Fridge'}
          </DialogTitle>
          <DialogDescription>
            {scanType === 'receipt' 
              ? 'Upload a photo of your grocery receipt to automatically add purchased items to your pantry'
              : 'Upload a photo of your fridge to identify available ingredients'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {step === 'upload' && renderUploadStep()}
          {step === 'analyzing' && renderAnalyzingStep()}
          {step === 'review' && renderReviewStep()}
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          
          {step === 'upload' && (
            <Button 
              onClick={handleAnalyze}
              disabled={selectedFiles.length === 0}
            >
              Analyze Images
            </Button>
          )}
          
          {step === 'review' && (
            <Button 
              onClick={handleConfirm}
              disabled={parsedItems.length === 0}
            >
              Add to Pantry ({parsedItems.length} items)
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PantryScanModal;