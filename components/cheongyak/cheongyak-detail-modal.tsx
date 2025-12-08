'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheongyakItem, CheongyakDetail } from '@/types/cheongyak'
import { getCheongyakDetail } from '@/lib/api/cheongyak'
import { formatDateKorean, formatCurrency } from '@/lib/utils/dateUtil'
import { 
  Building, 
  Calendar, 
  MapPin, 
  Users, 
  Phone, 
  ExternalLink,
  X
} from 'lucide-react'

interface CheongyakDetailModalProps {
  isOpen: boolean
  onClose: () => void
  item: CheongyakItem
}

export function CheongyakDetailModal({ isOpen, onClose, item }: CheongyakDetailModalProps) {
  const [detail, setDetail] = useState<CheongyakDetail | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && item.houseManageNo && item.pblancNo) {
      loadDetail()
    }
  }, [isOpen, item])

  const loadDetail = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await getCheongyakDetail(item.houseManageNo, item.pblancNo)
      if (response.success && response.data) {
        setDetail(response.data)
      } else {
        // 상세 정보가 없으면 기본 정보 사용
        setDetail(item as CheongyakDetail)
        setError(response.error || '상세 정보를 불러올 수 없습니다.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '상세 정보를 불러오는데 실패했습니다.')
      setDetail(item as CheongyakDetail)
    } finally {
      setIsLoading(false)
    }
  }

  const displayData = detail || item

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="청약 상세정보">
      <div className="space-y-6">
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">상세 정보를 불러오는 중...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* 기본 정보 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{displayData.houseNm}</h2>
                  <Badge className="bg-blue-100 text-blue-800">
                    {displayData.houseSecdNm}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-gray-400 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">주소</div>
                    <div className="font-medium">{displayData.hssplyAdres}</div>
                    {displayData.hssplyZip && (
                      <div className="text-xs text-gray-400">우편번호: {displayData.hssplyZip}</div>
                    )}
                  </div>
                </div>

                {displayData.mdhsTelno && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500">문의전화</div>
                      <div className="font-medium">{displayData.mdhsTelno}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 일정 정보 */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                일정 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">모집공고일</span>
                    <span className="text-sm font-medium">{formatDateKorean(displayData.rcritPblancDe)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">모집공고종료일</span>
                    <span className="text-sm font-medium">{formatDateKorean(displayData.rcritPblancEndDe)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">당첨자발표일</span>
                    <span className="text-sm font-medium">{formatDateKorean(displayData.przwnerPresnatnDe)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">계약시작일</span>
                    <span className="text-sm font-medium">{formatDateKorean(displayData.cntrctCnclsBgnde)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">계약종료일</span>
                    <span className="text-sm font-medium">{formatDateKorean(displayData.cntrctCnclsEndde)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">입주예정월</span>
                    <span className="text-sm font-medium">{displayData.mvnPrearngeYm || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 공급 정보 */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                공급 정보
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">총 공급세대수</div>
                  <div className="text-lg font-semibold">{displayData.totSuplyHshldco?.toLocaleString()}세대</div>
                </div>
                {displayData.houseDtlSecdNm && (
                  <div>
                    <div className="text-sm text-gray-600">주택상세구분</div>
                    <div className="text-lg font-semibold">{displayData.houseDtlSecdNm}</div>
                  </div>
                )}
              </div>
            </div>

            {/* 사업주체 정보 */}
            {displayData.bsnsMbyNm && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">사업주체 정보</h3>
                <div className="text-sm">
                  <div className="text-gray-600">사업주체명</div>
                  <div className="font-medium">{displayData.bsnsMbyNm}</div>
                </div>
              </div>
            )}

            {/* 특별공급 정보 */}
            {displayData.specltRdnEarthAtndNm && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">특별공급 정보</h3>
                <div className="text-sm">
                  <div className="text-gray-600">특별공급지구</div>
                  <div className="font-medium">{displayData.specltRdnEarthAtndNm}</div>
                </div>
              </div>
            )}

            {/* 추가 정보 */}
            {detail && (
              <>
                {detail.houseTyNm && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">주택형 정보</h3>
                    <div className="text-sm font-medium">{detail.houseTyNm}</div>
                  </div>
                )}

                {detail.prtpce && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">분양가격</h3>
                    <div className="text-lg font-semibold text-blue-600">
                      {formatCurrency(detail.prtpce)}
                    </div>
                  </div>
                )}

                {detail.etcPblancMatter && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">기타 공고사항</h3>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {detail.etcPblancMatter}
                    </div>
                  </div>
                )}

                {detail.pblancUrl && (
                  <div className="border-t pt-4">
                    <a
                      href={detail.pblancUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      공고 원문 보기
                    </a>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
              {displayData.mdhsTelno && (
                <Button asChild>
                  <a href={`tel:${displayData.mdhsTelno}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    전화문의
                  </a>
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

