// naver-land.ts (server only)
type ComplexHit = { complexNo: string; complexName: string };
type TradeType = 'A1' | 'B1' | 'B2'; // 매매/전세/월세

const NAVER_HEADERS = {
  'User-Agent': 'Mozilla/5.0',
  'Referer': 'https://new.land.naver.com',
  'Accept': 'application/json',
};

export async function findComplexNoByDong(
  cortarNo10: string,        // 법정동 10자리
  aptNameHint?: string       // API 응답의 aptNm 등
): Promise<ComplexHit | null> {
  try {
    console.log('네이버부동산 단지 검색 시작:', { cortarNo10, aptNameHint });
    
    // API 호출 제한을 피하기 위해 지연 추가
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const url = `https://new.land.naver.com/api/regions/complexes?cortarNo=${cortarNo10}&realEstateType=APT`;
    console.log('네이버부동산 API URL:', url);
    
    const res = await fetch(url, { headers: NAVER_HEADERS });
    console.log('네이버부동산 API 응답 상태:', res.status, res.statusText);
    
    if (res.status === 429) {
      console.error('네이버부동산 API 호출 제한에 걸림 (429). 잠시 후 다시 시도하세요.');
      return null;
    }
    
    if (!res.ok) {
      console.error('네이버부동산 API 호출 실패:', res.status, res.statusText);
      return null;
    }

    const json = await res.json() as any;
    console.log('네이버부동산 API 응답 데이터:', json);
    
    const list: any[] = json?.complexList ?? [];
    console.log('네이버부동산 단지 목록 수:', list.length);
    
    if (!list.length) {
      console.log('네이버부동산 단지 목록이 비어있음');
      return null;
    }

    // 1) 완전일치 2) 공백제거/대소문자 무시 3) 부분일치 순
    if (aptNameHint) {
      const norm = (s: string) => s.replace(/\s+/g,'').toLowerCase();
      const nHint = norm(aptNameHint);
      console.log('정규화된 아파트명 힌트:', nHint);
      
      // 완전일치 검색
      const exact = list.find(x => norm(x.complexName) === nHint);
      if (exact) {
        console.log('완전일치 단지 발견:', exact);
        return { complexNo: String(exact.complexNo), complexName: exact.complexName };
      }
      
      // 부분일치 검색 (포함)
      const part = list.find(x => norm(x.complexName).includes(nHint));
      if (part) {
        console.log('부분일치 단지 발견:', part);
        return { complexNo: String(part.complexNo), complexName: part.complexName };
      }
      
      console.log('매칭되는 단지가 없음. 첫 번째 단지 반환');
    }
    // 힌트 없거나 실패 → 첫 후보 반환
    const first = list[0];
    console.log('첫 번째 단지 반환:', first);
    return { complexNo: String(first.complexNo), complexName: first.complexName };
  } catch (error) {
    console.error('네이버부동산 단지 조회 실패:', error);
    return null;
  }
}

// 단지 중심 좌표 가져오기 → ms 파라미터용
export async function fetchComplexCenter(complexNo: string): Promise<{ lat: number; lon: number } | null> {
  try {
    console.log('단지 중심 좌표 조회 시작:', complexNo);
    
    const url = `https://new.land.naver.com/api/complexes/${complexNo}?sameAddressGroup=true`;
    const res = await fetch(url, { headers: NAVER_HEADERS });
    
    if (!res.ok) {
      console.error('단지 상세 정보 조회 실패:', res.status, res.statusText);
      return null;
    }
    
    const data = await res.json() as any;
    console.log('단지 상세 정보:', data);

    // 응답 스키마가 조금씩 달라서 여러 키 시도
    const cd = data?.complexDetail ?? data;
    const lat = Number(cd?.latitude ?? cd?.lat ?? cd?.y);
    const lon = Number(cd?.longitude ?? cd?.lng ?? cd?.x);
    
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      console.log('단지 중심 좌표 발견:', { lat, lon });
      return { lat, lon };
    }
    
    console.log('단지 중심 좌표를 찾을 수 없음');
    return null;
  } catch (error) {
    console.error('단지 중심 좌표 조회 실패:', error);
    return null;
  }
}

// 단지 내 매물 목록에서 articleNo 하나 고르기 (거래유형별)
export async function fetchComplexTopArticleNo(complexNo: string, tradeType: TradeType): Promise<string | null> {
  try {
    console.log('단지 매물 번호 조회 시작:', { complexNo, tradeType });
    
    const candidates = [
      // 가장 흔한 엔드포인트
      `https://new.land.naver.com/api/complexes/${complexNo}/articles?tradeType=${tradeType}&page=1&order=rank`,
      // 혹시 모를 대체
      `https://new.land.naver.com/api/articles?complexNo=${complexNo}&tradeType=${tradeType}&page=1&order=rank`,
    ];
    
    for (const url of candidates) {
      try {
        console.log('매물 API URL 시도:', url);
        const res = await fetch(url, { headers: NAVER_HEADERS });
        
        if (!res.ok) {
          console.warn('매물 API 호출 실패:', res.status, res.statusText);
          continue;
        }
        
        const j = await res.json() as any;
        console.log('매물 API 응답:', j);
        
        const list: any[] = j?.articleList ?? j?.list ?? j?.articles ?? [];
        if (Array.isArray(list) && list.length) {
          const first = list[0];
          const no = String(first.articleNo ?? first.articleNumber ?? first.atclNo ?? '');
          if (no) {
            console.log('매물 번호 발견:', no);
            return no;
          }
        }
      } catch (error) {
        console.warn('매물 API 엔드포인트 시도 실패:', url, error);
        continue;
      }
    }
    
    console.log('매물 번호를 찾을 수 없음');
    return null;
  } catch (error) {
    console.error('매물 번호 조회 실패:', error);
    return null;
  }
}

// 딥링크 생성기 (ms/zoom/articleNo 옵션 지원)
export function buildNaverLandUrlWithParams(complexNo: string, opts?: {
  ms?: { lat: number; lon: number; zoom?: number };
  articleNo?: string;
  a?: string; // 지도 오버레이 (기본 'APT')
}) {
  const search = new URLSearchParams();
  if (opts?.ms) search.set('ms', `${opts.ms.lat},${opts.ms.lon},${opts.ms.zoom ?? 16}`);
  search.set('a', opts?.a ?? 'APT');
  if (opts?.articleNo) search.set('articleNo', opts.articleNo);
  const qs = search.toString();
  return `https://new.land.naver.com/complexes/${complexNo}${qs ? `?${qs}` : ''}`;
}

// 모바일용 URL
export function buildNaverLandMobileUrl(complexNo: string, articleNo?: string) {
  const search = new URLSearchParams();
  if (articleNo) search.set('articleNo', articleNo);
  const qs = search.toString();
  return `https://m.land.naver.com/complex/${complexNo}${qs ? `?${qs}` : ''}`;
}

// 우리 도메인의 dealType → 네이버 tradeType 매핑
export function toNaverTradeType(dealType: 'sale'|'jeonse'|'wolse'): TradeType {
  return dealType === 'sale' ? 'A1' : dealType === 'jeonse' ? 'B1' : 'B2';
}

// 기존 함수들 (하위 호환성 유지)
export function buildNaverLandUrls(complexNo: string) {
  return {
    desktop: buildNaverLandUrlWithParams(complexNo),
    mobile: buildNaverLandMobileUrl(complexNo)
  };
}

// 법정동 코드를 10자리로 변환하는 유틸리티
export function deriveDongCortarNoFrom(bjdCode: string, dongName?: string): string | null {
  console.log('법정동 코드 변환 시작:', { bjdCode, dongName });
  
  if (!bjdCode) {
    console.log('bjdCode가 없음');
    return null;
  }
  
  // bjdCode가 10자리면 그대로 사용
  if (bjdCode.length === 10) {
    console.log('10자리 코드 그대로 사용:', bjdCode);
    return bjdCode;
  }
  
  // 5자리 시군구 코드인 경우, 동명으로 10자리 추정
  if (bjdCode.length === 5 && dongName) {
    const result = `${bjdCode}00000`; // 임시로 00000 추가
    console.log('5자리 코드를 10자리로 변환:', { from: bjdCode, to: result });
    return result;
  }
  
  console.log('변환 조건 불충족:', { bjdCodeLength: bjdCode.length, dongName });
  return null;
}
