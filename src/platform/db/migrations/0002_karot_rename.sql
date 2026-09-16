-- Rename KORA → KAROT without dropping data.
UPDATE cms_documents
SET slug = 'karot', title = 'KAROT', updated_at = datetime('now')
WHERE type = 'methodology' AND slug = 'kora'
  AND NOT EXISTS (SELECT 1 FROM cms_documents WHERE type = 'methodology' AND slug = 'karot');

UPDATE cms_documents
SET status = 'archived', archived_at = datetime('now'), updated_at = datetime('now')
WHERE type = 'methodology' AND slug = 'kora';

UPDATE cms_documents
SET payload = REPLACE(REPLACE(payload, '"kora"', '"karot"'), 'KORA', 'KAROT'),
    updated_at = datetime('now')
WHERE (payload LIKE '%kora%' OR payload LIKE '%KORA%')
  AND slug != 'kora';
