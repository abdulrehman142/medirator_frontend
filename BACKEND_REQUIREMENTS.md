# ChatGPT-Like Chat System - Backend Requirements

## Overview
This document outlines all backend endpoints, database schema, and integration requirements for the ChatGPT-like Medibot chat system.

---

## DATABASE SCHEMA

### 1. Chat Sessions Table
```sql
CREATE TABLE chat_sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) DEFAULT 'New Chat',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_updated_at (updated_at)
);
```

### 2. Chat Messages Table
```sql
CREATE TABLE chat_messages (
  id VARCHAR(36) PRIMARY KEY,
  session_id VARCHAR(36) NOT NULL,
  role ENUM('user', 'bot') NOT NULL,
  text LONGTEXT NOT NULL,
  files_json JSON,  -- Array of {id, name} objects
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  INDEX idx_session_id (session_id),
  INDEX idx_role (role)
);
```

### 3. Chat Attachments Table
```sql
CREATE TABLE chat_attachments (
  id VARCHAR(36) PRIMARY KEY,
  message_id VARCHAR(36) NOT NULL,
  session_id VARCHAR(36) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(512) NOT NULL,
  file_type VARCHAR(50) NOT NULL,  -- 'image/png', 'application/pdf', etc.
  file_size INT NOT NULL,  -- bytes
  stored_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
  INDEX idx_session_id (session_id),
  INDEX idx_message_id (message_id)
);
```

---

## API ENDPOINTS

### 1. Get All Chat Sessions
**Endpoint:** `GET /api/v1/chat/sessions`

**Authentication:** Bearer Token (required)

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": "chat-uuid-1",
    "title": "Health Issues Discussion",
    "created_at": 1704067200,
    "updated_at": 1704153600,
    "messages": [
      {
        "id": "msg-uuid-1",
        "role": "user",
        "text": "I have been feeling dizzy lately",
        "files": [
          {"id": "file-1", "name": "medical_report.pdf"},
          {"id": "file-2", "name": "symptoms.jpg"}
        ],
        "timestamp": 1704067200
      },
      {
        "id": "msg-uuid-2",
        "role": "bot",
        "text": "Based on your symptoms and the medical report...",
        "timestamp": 1704067300
      }
    ]
  }
]
```

---

### 2. Create New Chat Session
**Endpoint:** `POST /api/v1/chat/sessions`

**Authentication:** Bearer Token (required)

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Chat"  // optional, can be auto-generated or user-provided
}
```

**Response (201 Created):**
```json
{
  "id": "chat-uuid-new",
  "title": "New Chat",
  "created_at": 1704067200,
  "updated_at": 1704067200,
  "messages": []
}
```

---

### 3. Update Chat Session (Rename/Save Messages)
**Endpoint:** `PATCH /api/v1/chat/sessions/{chat_id}`

**Authentication:** Bearer Token (required)

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Chat Title",  // optional
  "messages": [...]            // optional, full message array to save
}
```

**Response (200 OK):**
```json
{
  "id": "chat-uuid",
  "title": "New Chat Title",
  "updated_at": 1704153600
}
```

---

### 4. Delete Chat Session
**Endpoint:** `DELETE /api/v1/chat/sessions/{chat_id}`

**Authentication:** Bearer Token (required)

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (204 No Content):**
```
(empty)
```

---

### 5. Send Message with File Upload (Main Chat Endpoint)
**Endpoint:** `POST /api/v1/chat/message`

**Authentication:** Bearer Token (required)

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**
```
message: "User's message text"
chat_id: "chat-uuid-123"
files: [File1, File2, ...]  // Optional file uploads
context_messages[0][role]: "user"
context_messages[0][text]: "Previous message 1"
context_messages[1][role]: "bot"
context_messages[1][text]: "Bot response 1"
... (all previous messages for context)
```

**Backend Processing:**
1. Save user message to `chat_messages` table
2. Store uploaded files in `chat_attachments` table
3. **Process files** (read PDF text, extract image EXIF data, etc.)
4. Send message to AI backend with:
   - User message
   - Chat history (context_messages)
   - File contents/analysis for context
5. Receive AI response
6. Save bot message to `chat_messages` table
7. Update `chat_sessions.updated_at`

**Response (200 OK):**
```json
{
  "reply": "AI response text based on message and file context",
  "model_used": "MedGemma-7B",
  "confidence": 0.92,
  "disclaimer": "This is AI-generated medical guidance. Consult a professional.",
  "files_processed": 2,
  "files_summary": {
    "medical_report.pdf": "PDF contains blood test results showing...",
    "symptoms.jpg": "Image shows symptoms documented with..."
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Chat not found or unauthorized"
}
```

---

### 6. Clear Chat History (Optional - For New Chat Button)
**Endpoint:** `DELETE /api/v1/chat/clear`

**Authentication:** Bearer Token (required)

**Request Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "All chat sessions cleared"
}
```

---

## FRONTEND → BACKEND DATA FLOW

### Flow 1: Load Chats on Page Load
```
Frontend:  GET /api/v1/chat/sessions
Backend:   Query chat_sessions + chat_messages for user
Response:  [Chat1, Chat2, Chat3, ...] with all messages
```

### Flow 2: Create New Chat
```
Frontend:  POST /api/v1/chat/sessions {title: "New Chat"}
Backend:   Create new chat_session record, return session ID
Frontend:  Store chat in local state, set as currentChatId
```

### Flow 3: Send Message
```
Frontend:  POST /api/v1/chat/message (FormData with files + context)
├─ Save user message to UI immediately
├─ Auto-generate title from first message (first 50 chars)
Backend:
├─ Save user message to DB
├─ Process/extract file contents
├─ Send to AI with chat history + file context
├─ Save AI response to DB
└─ Return AI response
Frontend:  Add bot message to UI
```

### Flow 4: Rename Chat
```
Frontend:  PATCH /api/v1/chat/sessions/{id} {title: "New Title"}
Backend:   Update chat_sessions.title
Frontend:  Update local state
```

### Flow 5: Delete Chat
```
Frontend:  DELETE /api/v1/chat/sessions/{id}
Backend:   Delete from chat_sessions (cascades to messages + attachments)
Frontend:  Remove from local state, switch to another chat
```

---

## FILE UPLOAD PROCESSING

### Accepted File Types
- Images: `png`, `jpg`, `jpeg`, `gif`, `webp` (max 5MB each)
- Documents: `pdf` (max 10MB)

### File Processing Requirements
1. **Images**: Extract EXIF metadata, compress if needed, convert to base64
2. **PDFs**: Extract text content, preserve structure (headings, lists)
3. **Storage**: Save files to `/uploads/chat_attachments/{user_id}/{chat_id}/`
4. **Virus Scan**: Run antivirus check before storing
5. **OCR (Optional)**: If image contains text, extract it for AI context

### AI Context Integration
Files must be analyzed and their content included when sending to AI:

```python
# Example: What backend sends to AI
{
    "user_message": "What do these test results show?",
    "chat_history": [...],
    "file_context": {
        "test_results.pdf": {
            "type": "pdf",
            "extracted_text": "Blood Test Report:\nHemoglobin: 14.5 g/dL\nWhite Cells: 7.2k...",
            "file_size": "125KB"
        },
        "report_image.jpg": {
            "type": "image",
            "ocr_text": "Patient Name: John Doe...",
            "detected_objects": ["chart", "graph", "table"]
        }
    }
}
```

---

## CONTEXT-AWARE RESPONSES

The AI should:
1. **Read entire chat history** (previous user & bot messages)
2. **Analyze all uploaded files** in the current chat
3. **Reference specific findings** from files ("According to your PDF report...")
4. **Maintain consistency** across messages (remember what was discussed)
5. **Return medical-specific responses** based on patient data

Example:
```
User: "Are these results normal?"
[Sends medical_report.pdf]

AI Response: "Based on your medical report, your hemoglobin level 
of 14.5 g/dL is within normal range (13.5-17.5 for men). However, 
your white blood cell count of 11.2k is slightly elevated..."
```

---

## SECURITY REQUIREMENTS

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only access their own chats
3. **File Validation**: 
   - Verify file type (magic bytes, not just extension)
   - Scan for malware
   - Enforce file size limits
4. **Data Privacy**: 
   - Encrypt files at rest
   - Log all access
   - Auto-delete old attachments (30 days)
5. **Rate Limiting**: 
   - Max 100 messages/hour per user
   - Max 50MB files/day per user

---

## ERROR HANDLING

Return appropriate HTTP status codes:
- `200 OK`: Success
- `201 Created`: Resource created
- `204 No Content`: Success (no response body)
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Access denied
- `404 Not Found`: Chat/message not found
- `413 Payload Too Large`: File too large
- `500 Internal Server Error`: Server error

---

## TESTING CHECKLIST

- [ ] Create new chat → appears in sidebar
- [ ] Send message → auto-save to DB
- [ ] Upload file → stored correctly
- [ ] AI reads file → includes in response
- [ ] Rename chat → title updates everywhere
- [ ] Delete chat → removed from DB + sidebar
- [ ] Page refresh → all chats + messages load
- [ ] Multiple files → all processed
- [ ] Context preserved → AI references earlier messages
- [ ] File too large → rejection with error
- [ ] Unauthorized access → 403 Forbidden

---

## IMPLEMENTATION PRIORITY

**Phase 1 (Critical):**
1. Chat sessions table + CRUD endpoints
2. Chat messages table + save/load
3. File upload endpoint
4. Basic AI integration with file context

**Phase 2 (Important):**
1. Advanced file processing (PDF text extraction, image OCR)
2. File attachment table + tracking
3. Context optimization (pagination for old messages)

**Phase 3 (Nice-to-have):**
1. File search indexing
2. Chat export (PDF/JSON)
3. Collaborative chats (share with other users)
4. Chat pinning/archiving
