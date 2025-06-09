"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { File, Upload, Check, Trash2 } from "lucide-react";
import * as motion from "motion/react-client";
import React from "react";

type VideoItemProps = {
  sectionId: number;
  video: {
    id: number;
    title: string;
    url?: string;
    serverId?: string;
  };
  updateVideoTitle: (
    sectionId: number,
    videoId: number,
    newTitle: string
  ) => void;
  handleVideoUpload: (sectionId: number, videoId: number, file: File) => void;
  saveVideoToServer: (
    videoId: number,
    sectionId: number,
    title: string,
    url: string
  ) => void;
  deleteVideo: (sectionId: number, videoId: number) => void;
  deleteVideoFromServer: (
    videoId: number,
    sectionId: number,
    title: string
  ) => void;
};

const VideoItemInput: React.FC<VideoItemProps> = ({
  sectionId,
  video,
  updateVideoTitle,
  handleVideoUpload,
  saveVideoToServer,
  deleteVideo,
  deleteVideoFromServer,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <File className="h-4 w-4 text-gray-500" />
      <Input
        placeholder="Video title"
        value={video.title}
        onChange={(e) => updateVideoTitle(sectionId, video.id, e.target.value)}
        className="flex-1"
      />
      <div className="relative">
        <Input
          type="file"
          accept="video/*"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleVideoUpload(sectionId, video.id, file);
            }
          }}
        />
        <Button type="button" variant="outline" size="sm">
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>
      </div>

      {video.url && (
        <a
          href={video.url}
          target="_blank"
          className="text-orange-500 text-sm underline ml-1"
          rel="noreferrer"
        >
          Preview Video
        </a>
      )}

      <div className="flex gap-4 items-center">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Check
            size={30}
            onClick={() =>
              saveVideoToServer(
                video.id,
                sectionId,
                video.title,
                video.url || ""
              )
            }
            className="cursor-pointer hover:bg-zinc-400 rounded p-1"
          />
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Trash2
            size={30}
            onClick={() =>
              video.serverId
                ? deleteVideoFromServer(video.id, sectionId, video.title)
                : deleteVideo(sectionId, video.id)
            }
            className="cursor-pointer hover:bg-zinc-400 rounded p-1"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default VideoItemInput;
