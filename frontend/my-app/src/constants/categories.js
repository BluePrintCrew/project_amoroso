export const TOP_CATEGORY_MAP = {
  LIVING: '거실',
  BEDROOM: '침실',
  KITCHEN: '주방',
  OFFICE: '사무실',
  DRESSING: '드레스룸',
  ETC: '기타',
};

export const CATEGORY_MAP = {
  LIVING: [
    { label: '소파', value: 'LIVING_SOFA' },
    { label: '장식장', value: 'LIVING_DISPLAY_CABINET' },
    { label: '탁자', value: 'LIVING_TABLE' },
  ],
  BEDROOM: [
    { label: '침대', value: 'BEDROOM_BED' },
    { label: '침대 깔판', value: 'BEDROOM_BED_BASE' },
    { label: '협탁', value: 'BEDROOM_NIGHTSTAND' },
  ],
  KITCHEN: [{ label: '식탁 & 의자', value: 'KITCHEN_DINING_SET' }],
  OFFICE: [
    { label: '책상', value: 'OFFICE_DESK' },
    { label: '의자', value: 'OFFICE_CHAIR' },
    { label: '책장', value: 'OFFICE_BOOKSHELF' },
  ],
  DRESSING: [
    { label: '장롱', value: 'DRESSING_WARDROBE' },
    { label: '화장대', value: 'DRESSING_TABLE' },
    { label: '드레스', value: 'DRESSING_DRESSER' },
    { label: '서랍장', value: 'DRESSING_DRAWER' },
  ],
  ETC: [
    { label: '소품', value: 'ETC_DECORATION' },
    { label: '벽걸이 거울', value: 'ETC_WALL_MIRROR' },
    { label: '액세서리', value: 'ETC_ACCESSORY' },
    { label: '거울', value: 'ETC_GENERAL_MIRROR' },
  ],
};

export const SORT_OPTIONS = [
  { label: '최신순', value: 'createdAt', order: 'desc' },
  { label: '가격 낮은순', value: 'marketPrice', order: 'asc' },
  { label: '가격 높은순', value: 'marketPrice', order: 'desc' },
]; 