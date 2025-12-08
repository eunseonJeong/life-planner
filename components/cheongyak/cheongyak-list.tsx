'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loading } from '@/components/Loading'
import { Error } from '@/components/Error'
import { Empty } from '@/components/Empty'
import { CheongyakItem } from '@/types/cheongyak'
import { getCheongyakList, CheongyakType } from '@/lib/api/cheongyak'
import { HOUSE_TYPE_OPTIONS, REGION_OPTIONS } from '@/lib/data/cheongyak-options'
import { formatDateDot } from '@/lib/utils/dateUtil'
import { Building, Calendar, MapPin, Users, Eye, Filter, RefreshCw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { CheongyakDetailModal } from './cheongyak-detail-modal'

interface CheongyakListProps {
  limit?: number
  itemsPerPage?: number
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export function CheongyakList({ limit = 100, itemsPerPage: initialItemsPerPage = 10 }: CheongyakListProps) {
  const [items, setItems] = useState<CheongyakItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<CheongyakItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 필터 상태
  const [houseType, setHouseType] = useState<CheongyakType>('all')
  const [region, setRegion] = useState<string>('all')

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

  const loadCheongyakList = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    // 'all'이면 undefined로 변환 (전체 조회)
    const regionValue = region === 'all' ? undefined : region

    try {
      const response = await getCheongyakList(
        {
          numOfRows: limit,
          page: 1,
          sido: regionValue,
        },
        houseType
      )

      if (response.success && response.data) {
        // 지역 필터링 (API에서 완벽히 처리 안되면 클라이언트에서 추가 필터링)
        let filteredItems = response.data
        if (regionValue) {
          filteredItems = response.data.filter(item =>
            item.hssplyAdres?.includes(regionValue) ||
            item.subscrptAreaCodeNm?.includes(regionValue) ||
            item.SUBSCRPT_AREA_CODE_NM?.includes(regionValue)
          )
        }
        setItems(filteredItems)
      } else {
        setError(response.error || '청약 정보를 불러오는데 실패했습니다.')
      }
    } catch (e) {
      setError((e as Error)?.message || '청약 정보를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [limit, houseType, region])

  useEffect(() => {
    loadCheongyakList()
  }, [loadCheongyakList])

  const handleItemClick = (item: CheongyakItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const getHouseTypeColor = (houseSecdNm: string) => {
    const name = houseSecdNm?.toUpperCase() || ''
    if (name.includes('APT') || name.includes('아파트')) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
    if (name.includes('오피스텔')) {
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    }
    if (name.includes('도시형')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    }
    if (name.includes('민간임대')) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    }
    if (name.includes('잔여') || name.includes('무순위')) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    }
    return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  const handleReset = () => {
    setHouseType('all')
    setRegion('all')
    setCurrentPage(1)
  }

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1)
  }, [houseType, region])

  // 페이지네이션 계산
  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedItems = items.slice(startIndex, endIndex)

  // 페이지 번호 배열 생성 (현재 페이지 주변 5개)
  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // 끝에서 시작 조정
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      // 페이지 변경 시 스크롤 위로
      window.scrollTo({ top: 840, behavior: 'smooth' })
    }
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              청약 분양정보
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadCheongyakList}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* 필터 영역 */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">필터</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {/* 주택 유형 필터 */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-gray-500 mb-1">주택 유형</label>
                <Select value={houseType} onValueChange={(value) => setHouseType(value as CheongyakType)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="주택 유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOUSE_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 지역 필터 */}
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-gray-500 mb-1">지역</label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="지역 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 필터 초기화 버튼 */}
              <div className="flex items-end">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  초기화
                </Button>
              </div>
            </div>

            {/* 필터 결과 요약 */}
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {isLoading ? (
                <Loading title="데이터를 불러오는 중..." />
              ) : (
                <span>
                  총 <strong className="text-blue-600">{items.length}</strong>건의 청약 정보
                  {houseType !== 'all' && (
                    <Badge variant="secondary" className="ml-2">
                      {HOUSE_TYPE_OPTIONS.find(o => o.value === houseType)?.label}
                    </Badge>
                  )}
                  {region !== 'all' && (
                    <Badge variant="secondary" className="ml-2">
                      {REGION_OPTIONS.find(o => o.value === region)?.label}
                    </Badge>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* 로딩 상태 */}
          {isLoading && (
            <div className="p-8 text-center">
              <Loading title="데이터를 불러오는 중..." />
            </div>
          )}

          {/* 에러 상태 */}
          {!isLoading && error && (
            <div className="p-8 text-center">
              <Error error={error} onRetry={loadCheongyakList} />
            </div>
          )}

          {/* 빈 상태 */}
          {!isLoading && !error && items.length === 0 && (
            <Empty
              icon={<Building className="h-12 w-12" />}
              title={
                houseType !== 'all' || region !== 'all'
                  ? '선택한 조건에 맞는 청약 정보가 없습니다.'
                  : '현재 분양 중인 청약 정보가 없습니다.'
              }
              actionLabel={houseType !== 'all' || region !== 'all' ? '필터 초기화하기' : undefined}
              onAction={houseType !== 'all' || region !== 'all' ? handleReset : undefined}
            />
          )}

          {/* 목록 */}
          {!isLoading && !error && items.length > 0 && (
            <div className="space-y-4">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{item.houseNm || item.HOUSE_NM}</h3>
                        <Badge className={getHouseTypeColor(item.houseSecdNm || item.HOUSE_SECD_NM || '')}>
                          {item.houseSecdNm || item.HOUSE_SECD_NM || '분양'}
                        </Badge>
                        {(item.subscrptAreaCodeNm || item.SUBSCRPT_AREA_CODE_NM) && (
                          <Badge variant="outline">
                            {item.subscrptAreaCodeNm || item.SUBSCRPT_AREA_CODE_NM}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="truncate">{item.hssplyAdres || item.HSSPLY_ADRES || '-'}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      <Eye className="h-4 w-4 mr-1" />
                      상세보기
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="text-gray-500">모집공고일</div>
                        <div className="font-medium">
                          {formatDateDot(item.rcritPblancDe || item.RCRIT_PBLANC_DE)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="text-gray-500">공급세대</div>
                        <div className="font-medium">
                          {(item.totSuplyHshldco || item.TOT_SUPLY_HSHLDCO || 0).toLocaleString()}세대
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="text-gray-500">당첨자발표</div>
                        <div className="font-medium">
                          {formatDateDot(item.przwnerPresnatnDe || item.PRZWNER_PRESNATN_DE)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="text-gray-500">입주예정</div>
                        <div className="font-medium">
                          {item.mvnPrearngeYm || item.MVN_PREARNGE_YM || '-'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {(item.bsnsMbyNm || item.BSNS_MBY_NM) && (
                    <div className="mt-2 text-xs text-gray-500">
                      사업주체: {item.bsnsMbyNm || item.BSNS_MBY_NM}
                    </div>
                  )}
                </div>
              ))}

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
                  {/* 페이지 정보 및 페이지당 개수 선택 */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>
                      {startIndex + 1}-{Math.min(endIndex, totalItems)} / 총 {totalItems}건
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">페이지당</span>
                      <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger className="w-20 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                            <SelectItem key={option} value={String(option)}>
                              {option}개
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* 페이지 네비게이션 */}
                  <div className="flex items-center gap-1">
                    {/* 처음 페이지 */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* 이전 페이지 */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* 페이지 번호 */}
                    <div className="flex items-center gap-1 mx-2">
                      {getPageNumbers().map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    {/* 다음 페이지 */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* 마지막 페이지 */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedItem && (
        <CheongyakDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedItem(null)
          }}
          item={selectedItem}
        />
      )}
    </>
  )
}
