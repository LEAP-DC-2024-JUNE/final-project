"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type AddSectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionName: string) => Promise<void>;
};

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
  onAddSection,
}) => {
  const [sectionName, setSectionName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSectionName("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!sectionName.trim()) return;
    setLoading(true);
    try {
      await onAddSection(sectionName.trim());
      onClose();
    } catch {
      // handle error if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Add New Section</DialogTitle>
        </DialogHeader>

        <input
          ref={inputRef}
          type="text"
          placeholder="Section title"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          className="w-full border rounded px-3 py-2 my-4"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
            if (e.key === "Escape") {
              onClose();
            }
          }}
        />

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !sectionName.trim()}
          >
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
