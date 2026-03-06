export interface PublicMeetingTranscriptSegment {
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface PublicMeetingSpeaker {
  speakerLabel: string;
  displayName: string | null;
}

export interface PublicMeetingSummary {
  summary: string;
  keyPoints: string[];
}

export interface PublicMeetingTask {
  title: string;
  isCompleted: boolean;
}

export interface PublicMeetingInfo {
  title: string;
  type: 'SCHEDULED' | 'RECORDED' | 'VOICE_NOTE';
  createdAt: string;
  startTime: string | null;
}

export interface PublicMeetingResponse {
  shortId: string;
  meeting: PublicMeetingInfo;
  speakers: PublicMeetingSpeaker[];
  transcript: PublicMeetingTranscriptSegment[] | null;
  summary: PublicMeetingSummary | null;
  tasks: PublicMeetingTask[] | null;
}
