-- Travel guides' "File to download" sections take more than PDFs (decided 2026-11-18): documents (PDF, DOC, DOCX,
-- TXT, RTF), spreadsheets (XLS, XLSX, CSV, ODS), presentations (PPT, PPTX, ODP), images (JPG, PNG, WebP, GIF, SVG),
-- audio (MP3, WAV, M4A, OGG) and archives (ZIP, RAR, 7Z), as GUIDE_FILE_FORMATS in @ttn/config/guideFiles lists them.
-- The admin signs each upload for its format's type and checks the file's content afterwards; this only lets the
-- trek-files bucket (used when S3 isn't set up) store those types. Its 15 MB limit stays.
-- The section's settings ({ "path", "byteSize" }) need no change: save_article and web_travel_guide_pages take and send
-- them as they are.
update storage.buckets
set allowed_mime_types = array[
  -- The trek's printable map and GPS track.
  'application/pdf',
  'application/gpx+xml',
  -- Documents.
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
  -- Spreadsheets.
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.oasis.opendocument.spreadsheet',
  -- Presentations.
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.presentation',
  -- Images.
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  -- Audio.
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/ogg',
  -- Archives.
  'application/zip',
  'application/vnd.rar',
  'application/x-7z-compressed'
]
where id = 'trek-files';
