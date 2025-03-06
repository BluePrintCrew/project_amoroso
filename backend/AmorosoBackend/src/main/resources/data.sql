INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
VALUES
    ('전체보기', 'ALL', NULL, NOW(), NOW()),
    ('거실',     NULL,  NULL, NOW(), NOW()),
    ('침실',     NULL,  NULL, NOW(), NOW()),
    ('주방',     NULL,  NULL, NOW(), NOW()),
    ('홈오피스', NULL,  NULL, NOW(), NOW()),
    ('드레스룸', NULL,  NULL, NOW(), NOW()),
    ('기타',     NULL,  NULL, NOW(), NOW());

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '소파', 'LIVING_SOFA', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '거실';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '장식장', 'LIVING_DISPLAY_CABINET', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '거실';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '탁자', 'LIVING_TABLE', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '거실';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '침대', 'BEDROOM_BED', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '침실';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '침대 깔판', 'BEDROOM_BED_BASE', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '침실';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '협탁', 'BEDROOM_NIGHTSTAND', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '침실';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '식탁 & 의자', 'KITCHEN_DINING_SET', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '주방';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '책상', 'OFFICE_DESK', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '홈오피스';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '의자', 'OFFICE_CHAIR', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '홈오피스';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '책장', 'OFFICE_BOOKSHELF', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '홈오피스';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '장롱', 'DRESSING_WARDROBE', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '드레스룸';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '화장대', 'DRESSING_TABLE', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '드레스룸';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '드레스', 'DRESSING_DRESSER', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '드레스룸';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '서랍장', 'DRESSING_DRAWER', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '드레스룸';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '소품', 'ETC_DECORATION', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '기타';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '벽걸이 거울', 'ETC_WALL_MIRROR', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '기타';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '액세서리', 'ETC_ACCESSORY', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '기타';

INSERT INTO categories (category_name, category_code, parent_id, created_at, updated_at)
SELECT '거울', 'ETC_GENERAL_MIRROR', category_id, NOW(), NOW()
FROM categories
WHERE category_name = '기타';
