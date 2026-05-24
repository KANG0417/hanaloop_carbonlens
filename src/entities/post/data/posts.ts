import type { Post } from '../model/post.types';

export const POSTS: Post[] = [
  {
    id: 'p1',
    title: '2025년 2분기 탄소 배출량 보고서',
    resourceUid: 'c1',
    dateTime: '2025-07',
    content: '하나루프의 2025년 2분기 온실가스 배출량은 전분기 대비 4.2% 감소하였습니다. 전기 사용 절감과 경유 차량 운행 최적화가 주요 요인으로 분석됩니다.',
  },
  {
    id: 'p2',
    title: '2025년 1분기 탄소 배출량 보고서',
    resourceUid: 'c1',
    dateTime: '2025-04',
    content: '2025년 1분기 총 배출량은 225.4 tCO₂e로, 천연가스 사용 비중이 전체의 15.3%를 차지하였습니다.',
  },
  {
    id: 'p3',
    title: 'SinoGreen 상반기 배출 현황',
    resourceUid: 'c3',
    dateTime: '2025-06',
    content: 'SinoGreen의 2025년 상반기 총 배출량은 783.2 tCO₂e입니다. 전기 의존도가 높아 재생에너지 전환 계획을 수립 중입니다.',
  },
  {
    id: 'p4',
    title: 'GreenWerk 탄소중립 로드맵',
    resourceUid: 'c5',
    dateTime: '2025-05',
    content: 'GreenWerk는 2030년까지 Scope 1·2 배출량 50% 감축을 목표로 하며, 천연가스에서 그린수소로의 전환을 검토하고 있습니다.',
  },
  {
    id: 'p5',
    title: 'CleanMfg 연간 배출 현황',
    resourceUid: 'c6',
    dateTime: '2025-03',
    content: 'CleanMfg의 2025년 연간 전망 배출량은 약 1,380 tCO₂e로, 휘발유 차량 전동화를 통해 약 12% 추가 감축이 가능할 것으로 분석됩니다.',
  },
];
