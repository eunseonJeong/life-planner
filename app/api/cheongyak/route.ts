import { NextRequest, NextResponse } from 'next/server'
import { 
  getCheongyakList, 
  getCheongyakDetail, 
  getOfficetelList, 
  getRemndrList, 
  getPublicRentList, 
  getOptionalList,
  getAllCheongyakList,
  getCheongyakModelDetail,
  CheongyakType
} from '@/lib/services/cheongyak-home'
import { CheongyakQueryParams } from '@/types/cheongyak'

/**
 * GET /api/cheongyak
 * 청약홈 분양정보 조회
 * 
 * Query Parameters:
 * - type: 청약 유형 (apt, officetel, remndr, public_rent, optional, all)
 * - page: 페이지 번호 (기본값: 1)
 * - numOfRows: 페이지당 개수 (기본값: 20)
 * - houseSecd: 주택구분코드
 * - rcritPblancDe: 모집공고 시작일
 * - rcritPblancEndDe: 모집공고 종료일
 * - sido: 시도
 * - sigungu: 시군구
 * - houseManageNo: 주택관리번호 (상세 조회 시)
 * - pblancNo: 공고번호 (상세 조회 시)
 * - model: 주택형별 상세 조회 플래그
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const type = (searchParams.get('type') || 'apt') as CheongyakType
    const model = searchParams.get('model') === 'true'
    
    const params: CheongyakQueryParams = {
      page: parseInt(searchParams.get('page') || '1', 10),
      numOfRows: parseInt(searchParams.get('numOfRows') || '20', 10),
    }

    if (searchParams.get('houseSecd')) {
      params.houseSecd = searchParams.get('houseSecd') || undefined
    }
    if (searchParams.get('rcritPblancSe')) {
      params.rcritPblancSe = searchParams.get('rcritPblancSe') || undefined
    }
    if (searchParams.get('rcritPblancDe')) {
      params.rcritPblancDe = searchParams.get('rcritPblancDe') || undefined
    }
    if (searchParams.get('rcritPblancEndDe')) {
      params.rcritPblancEndDe = searchParams.get('rcritPblancEndDe') || undefined
    }
    if (searchParams.get('sido')) {
      params.sido = searchParams.get('sido') || undefined
    }
    if (searchParams.get('sigungu')) {
      params.sigungu = searchParams.get('sigungu') || undefined
    }

    // 상세 조회
    const houseManageNo = searchParams.get('houseManageNo')
    const pblancNo = searchParams.get('pblancNo')
    
    if (houseManageNo && pblancNo) {
      // 주택형별 상세 조회
      if (model) {
        const modelData = await getCheongyakModelDetail(houseManageNo, pblancNo, type)
        return NextResponse.json({
          success: true,
          data: modelData,
        })
      }
      
      // 일반 상세 조회
      const detail = await getCheongyakDetail(houseManageNo, pblancNo, type)
      return NextResponse.json({
        success: true,
        data: detail,
      })
    }

    // 목록 조회 - 유형별
    let list
    switch (type) {
      case 'apt':
        list = await getCheongyakList(params)
        break
      case 'officetel':
        list = await getOfficetelList(params)
        break
      case 'remndr':
        list = await getRemndrList(params)
        break
      case 'public_rent':
        list = await getPublicRentList(params)
        break
      case 'optional':
        list = await getOptionalList(params)
        break
      case 'all':
        list = await getAllCheongyakList(params)
        break
      default:
        list = await getCheongyakList(params)
    }
    
    return NextResponse.json({
      success: true,
      data: list,
      count: list.length,
    })
  } catch (error) {
    console.error('청약홈 API 호출 실패:', error)
    
    // 에러 메시지 추출
    let errorMessage = '청약홈 정보 조회에 실패했습니다.'
    if (error instanceof Error) {
      errorMessage = error.message
      // API 키 관련 에러인 경우 더 명확한 메시지
      if (errorMessage.includes('서비스키') || errorMessage.includes('API')) {
        errorMessage = '청약홈 API 서비스키가 설정되지 않았습니다. .env.local에 NEXT_PUBLIC_CHEONGYAK_API_KEY를 설정하세요.'
      }
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage
      },
      { status: 500 }
    )
  }
}
