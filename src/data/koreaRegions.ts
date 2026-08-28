import { RegionInfo } from '../types';

export const KOREA_MAJOR_REGIONS: RegionInfo[] = [
  // 서울특별시
  { id: 'seoul-jung', name: '중구 (명동/시청)', fullName: '서울특별시 중구', province: '서울특별시', city: '중구', lat: 37.5636, lng: 126.9975, nx: 60, ny: 127 },
  { id: 'seoul-jongno', name: '종로구 (광화문)', fullName: '서울특별시 종로구', province: '서울특별시', city: '종로구', lat: 37.5730, lng: 126.9794, nx: 60, ny: 127 },
  { id: 'seoul-gangnam', name: '강남구 (역삼/삼성)', fullName: '서울특별시 강남구', province: '서울특별시', city: '강남구', lat: 37.4959, lng: 127.0664, nx: 61, ny: 125 },
  { id: 'seoul-seocho', name: '서초구 (양재/서초)', fullName: '서울특별시 서초구', province: '서울특별시', city: '서초구', lat: 37.4837, lng: 127.0324, nx: 61, ny: 125 },
  { id: 'seoul-songpa', name: '송파구 (잠실)', fullName: '서울특별시 송파구', province: '서울특별시', city: '송파구', lat: 37.5145, lng: 127.1066, nx: 62, ny: 126 },
  { id: 'seoul-mapo', name: '마포구 (홍대/상암)', fullName: '서울특별시 마포구', province: '서울특별시', city: '마포구', lat: 37.5663, lng: 126.9016, nx: 59, ny: 127 },
  { id: 'seoul-yongsan', name: '용산구 (이태원/한남)', fullName: '서울특별시 용산구', province: '서울특별시', city: '용산구', lat: 37.5326, lng: 126.9900, nx: 60, ny: 126 },
  { id: 'seoul-yeongdeungpo', name: '영등포구 (여의도)', fullName: '서울특별시 영등포구', province: '서울특별시', city: '영등포구', lat: 37.5264, lng: 126.8962, nx: 58, ny: 126 },
  { id: 'seoul-seongdong', name: '성동구 (성수/왕십리)', fullName: '서울특별시 성동구', province: '서울특별시', city: '성동구', lat: 37.5635, lng: 127.0368, nx: 61, ny: 127 },
  { id: 'seoul-gangdong', name: '강동구 (천호/길동)', fullName: '서울특별시 강동구', province: '서울특별시', city: '강동구', lat: 37.5301, lng: 127.1238, nx: 62, ny: 126 },
  { id: 'seoul-gwanak', name: '관악구 (서울대입구/신림)', fullName: '서울특별시 관악구', province: '서울특별시', city: '관악구', lat: 37.4784, lng: 126.9516, nx: 59, ny: 125 },

  // 경기도
  { id: 'gyeonggi-suwon', name: '수원시 (영통/팔달)', fullName: '경기도 수원시', province: '경기도', city: '수원시', lat: 37.2636, lng: 127.0286, nx: 60, ny: 121 },
  { id: 'gyeonggi-seongnam', name: '성남시 분당구 (판교/분당)', fullName: '경기도 성남시 분당구', province: '경기도', city: '성남시', district: '분당구', lat: 37.3827, lng: 127.1189, nx: 62, ny: 123 },
  { id: 'gyeonggi-goyang', name: '고양시 일산동구 (일산)', fullName: '경기도 고양시 일산동구', province: '경기도', city: '고양시', district: '일산동구', lat: 37.6584, lng: 126.7758, nx: 57, ny: 128 },
  { id: 'gyeonggi-yongin', name: '용인시 수지구 (수지/기흥)', fullName: '경기도 용인시 수지구', province: '경기도', city: '용인시', district: '수지구', lat: 37.3223, lng: 127.0975, nx: 62, ny: 121 },
  { id: 'gyeonggi-bucheon', name: '부천시 (중동/상동)', fullName: '경기도 부천시', province: '경기도', city: '부천시', lat: 37.5034, lng: 126.7660, nx: 57, ny: 125 },
  { id: 'gyeonggi-anyang', name: '안양시 동안구 (평촌)', fullName: '경기도 안양시 동안구', province: '경기도', city: '안양시', district: '동안구', lat: 37.3943, lng: 126.9568, nx: 59, ny: 123 },
  { id: 'gyeonggi-hwaseong', name: '화성시 (동탄)', fullName: '경기도 화성시', province: '경기도', city: '화성시', lat: 37.1995, lng: 127.0782, nx: 61, ny: 119 },
  { id: 'gyeonggi-hanam', name: '하남시 (미사)', fullName: '경기도 하남시', province: '경기도', city: '하남시', lat: 37.5393, lng: 127.2148, nx: 64, ny: 126 },
  { id: 'gyeonggi-namyangju', name: '남양주시 (다산/별내)', fullName: '경기도 남양주시', province: '경기도', city: '남양주시', lat: 37.6360, lng: 127.2165, nx: 64, ny: 128 },

  // 인천광역시
  { id: 'incheon-namdong', name: '인천 남동구 (구월/송도)', fullName: '인천광역시 남동구', province: '인천광역시', city: '남동구', lat: 37.4475, lng: 126.7314, nx: 55, ny: 124 },
  { id: 'incheon-yeonsu', name: '인천 연수구 (송도국제도시)', fullName: '인천광역시 연수구', province: '인천광역시', city: '연수구', lat: 37.4098, lng: 126.6783, nx: 55, ny: 123 },
  { id: 'incheon-bupyeong', name: '인천 부평구 (부평)', fullName: '인천광역시 부평구', province: '인천광역시', city: '부평구', lat: 37.5074, lng: 126.7219, nx: 55, ny: 125 },
  { id: 'incheon-junggu', name: '인천 중구 (영종도/인천공항)', fullName: '인천광역시 중구', province: '인천광역시', city: '중구', lat: 37.4636, lng: 126.5498, nx: 54, ny: 124 },

  // 부산광역시
  { id: 'busan-haeundae', name: '부산 해운대구 (센텀/마린시티)', fullName: '부산광역시 해운대구', province: '부산광역시', city: '해운대구', lat: 35.1631, lng: 129.1636, nx: 99, ny: 75 },
  { id: 'busan-busanjin', name: '부산 부산진구 (서면)', fullName: '부산광역시 부산진구', province: '부산광역시', city: '부산진구', lat: 35.1627, lng: 129.0532, nx: 97, ny: 75 },
  { id: 'busan-suyeong', name: '부산 수영구 (광안리)', fullName: '부산광역시 수영구', province: '부산광역시', city: '수영구', lat: 35.1456, lng: 129.1131, nx: 98, ny: 75 },
  { id: 'busan-jung', name: '부산 중구 (남포동/자갈치)', fullName: '부산광역시 중구', province: '부산광역시', city: '중구', lat: 35.1062, lng: 129.0324, nx: 97, ny: 74 },

  // 대구광역시
  { id: 'daegu-suseong', name: '대구 수성구 (범어/수성못)', fullName: '대구광역시 수성구', province: '대구광역시', city: '수성구', lat: 35.8584, lng: 128.6306, nx: 89, ny: 90 },
  { id: 'daegu-jung', name: '대구 중구 (동성로)', fullName: '대구광역시 중구', province: '대구광역시', city: '중구', lat: 35.8694, lng: 128.6062, nx: 89, ny: 90 },

  // 대전광역시
  { id: 'daejeon-yuseong', name: '대전 유성구 (카이스트/노은)', fullName: '대전광역시 유성구', province: '대전광역시', city: '유성구', lat: 36.3622, lng: 127.3563, nx: 67, ny: 101 },
  { id: 'daejeon-seo', name: '대전 서구 (둔산동)', fullName: '대전광역시 서구', province: '대전광역시', city: '서구', lat: 36.3556, lng: 127.3837, nx: 67, ny: 100 },

  // 광주광역시
  { id: 'gwangju-seo', name: '광주 서구 (상무지구)', fullName: '광주광역시 서구', province: '광주광역시', city: '서구', lat: 35.1520, lng: 126.8898, nx: 58, ny: 74 },
  { id: 'gwangju-dong', name: '광주 동구 (충장로)', fullName: '광주광역시 동구', province: '광주광역시', city: '동구', lat: 35.1460, lng: 126.9231, nx: 59, ny: 74 },

  // 울산광역시
  { id: 'ulsan-nam', name: '울산 남구 (삼산동)', fullName: '울산광역시 남구', province: '울산광역시', city: '남구', lat: 35.5441, lng: 129.3319, nx: 102, ny: 84 },

  // 세종특별자치시
  { id: 'sejong', name: '세종특별자치시 (어진동/정부청사)', fullName: '세종특별자치시', province: '세종특별자치시', city: '세종특별자치시', lat: 36.4800, lng: 127.2890, nx: 66, ny: 103 },

  // 강원특별자치도
  { id: 'gangwon-chuncheon', name: '강원 춘천시', fullName: '강원특별자치도 춘천시', province: '강원특별자치도', city: '춘천시', lat: 37.8813, lng: 127.7298, nx: 73, ny: 134 },
  { id: 'gangwon-gangneung', name: '강원 강릉시 (경포/안목)', fullName: '강원특별자치도 강릉시', province: '강원특별자치도', city: '강릉시', lat: 37.7519, lng: 128.8761, nx: 92, ny: 131 },
  { id: 'gangwon-wonju', name: '강원 원주시', fullName: '강원특별자치도 원주시', province: '강원특별자치도', city: '원주시', lat: 37.3422, lng: 127.9202, nx: 76, ny: 122 },
  { id: 'gangwon-sokcho', name: '강원 속초시', fullName: '강원특별자치도 속초시', province: '강원특별자치도', city: '속초시', lat: 38.2070, lng: 128.5918, nx: 87, ny: 141 },

  // 충청북도 / 충청남도
  { id: 'chungbuk-cheongju', name: '충북 청주시', fullName: '충청북도 청주시', province: '충청북도', city: '청주시', lat: 36.6424, lng: 127.4890, nx: 69, ny: 107 },
  { id: 'chungnam-cheonan', name: '충남 천안시 (불당/쌍용)', fullName: '충청남도 천안시', province: '충청남도', city: '천안시', lat: 36.8151, lng: 127.1139, nx: 63, ny: 110 },
  { id: 'chungnam-asan', name: '충남 아산시', fullName: '충청남도 아산시', province: '충청남도', city: '아산시', lat: 36.7898, lng: 127.0019, nx: 60, ny: 110 },

  // 전북특별자치도 / 전라남도
  { id: 'jeonbuk-jeonju', name: '전북 전주시 (한옥마을/효자)', fullName: '전북특별자치도 전주시', province: '전북특별자치도', city: '전주시', lat: 35.8242, lng: 127.1480, nx: 63, ny: 89 },
  { id: 'jeonnam-yeosu', name: '전남 여수시 (오동도/여수엑스포)', fullName: '전라남도 여수시', province: '전라남도', city: '여수시', lat: 34.7604, lng: 127.6622, nx: 73, ny: 66 },
  { id: 'jeonnam-suncheon', name: '전남 순천시 (순천만)', fullName: '전라남도 순천시', province: '전라남도', city: '순천시', lat: 34.9506, lng: 127.4872, nx: 70, ny: 70 },
  { id: 'jeonnam-mokpo', name: '전남 목포시', fullName: '전라남도 목포시', province: '전라남도', city: '목포시', lat: 34.8118, lng: 126.3922, nx: 50, ny: 67 },

  // 경상북도 / 경상남도
  { id: 'gyeongbuk-pohang', name: '경북 포항시 (영일대/포스코)', fullName: '경상북도 포항시', province: '경상북도', city: '포항시', lat: 36.0190, lng: 129.3435, nx: 102, ny: 94 },
  { id: 'gyeongbuk-gyeongju', name: '경북 경주시 (보문/황리단길)', fullName: '경상북도 경주시', province: '경상북도', city: '경주시', lat: 35.8562, lng: 129.2247, nx: 100, ny: 91 },
  { id: 'gyeongnam-changwon', name: '경남 창원시 (상남/마산)', fullName: '경상남도 창원시', province: '경상남도', city: '창원시', lat: 35.2280, lng: 128.6811, nx: 90, ny: 77 },
  { id: 'gyeongnam-jeju', name: '제주 제주시 (공항/도청)', fullName: '제주특별자치도 제주시', province: '제주특별자치도', city: '제주시', lat: 33.4996, lng: 126.5312, nx: 52, ny: 38 },
  { id: 'gyeongnam-seogwipo', name: '제주 서귀포시 (중문)', fullName: '제주특별자치도 서귀포시', province: '제주특별자치도', city: '서귀포시', lat: 33.2541, lng: 126.5601, nx: 52, ny: 33 },
  { id: 'dokdo', name: '독도 / 울릉도', fullName: '경상북도 울릉군', province: '경상북도', city: '울릉군', lat: 37.4844, lng: 130.9056, nx: 127, ny: 127 }
];

export function findNearestRegion(lat: number, lng: number): RegionInfo {
  let nearest = KOREA_MAJOR_REGIONS[0];
  let minDistance = Number.MAX_VALUE;

  for (const region of KOREA_MAJOR_REGIONS) {
    const dLat = region.lat - lat;
    const dLng = region.lng - lng;
    const distance = dLat * dLat + dLng * dLng;
    if (distance < minDistance) {
      minDistance = distance;
      nearest = region;
    }
  }

  return nearest;
}
