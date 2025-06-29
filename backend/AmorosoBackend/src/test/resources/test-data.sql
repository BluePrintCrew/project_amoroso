-- H2 데이터베이스에서 참조 무결성 검사 비활성화
SET REFERENTIAL_INTEGRITY FALSE;

-- 테스트용 기본 데이터 삽입 (필요한 경우)
-- 예: 카테고리 테이블 기본 데이터
-- INSERT INTO categories (category_name, category_code) VALUES ('기본카테고리', 'DEFAULT');

-- 테스트 완료 후 참조 무결성 검사 활성화
-- SET REFERENTIAL_INTEGRITY TRUE;