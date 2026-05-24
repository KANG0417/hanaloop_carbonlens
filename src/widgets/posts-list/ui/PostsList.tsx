import { POSTS } from '@/entities/post';
import { COMPANIES } from '@/entities/company';

export const PostsList = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
    <div className="flex items-center justify-between mb-5">
      <div>
        <h3 className="text-base font-bold text-gray-900">보고서 및 자료</h3>
        <p className="text-xs text-gray-400 mt-0.5">최신 탄소 배출 보고서와 가이드</p>
      </div>
      <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
        {POSTS.length}건
      </span>
    </div>

    <div className="flex flex-col gap-3">
      {POSTS.map((post) => {
        const company = COMPANIES.find((c) => c.id === post.resourceUid);
        return (
          <div
            key={post.id}
            className="flex items-start gap-4 p-4 rounded-xl border border-transparent bg-gray-50/60 hover:bg-gray-50 hover:border-gray-100 transition-all duration-150 cursor-pointer group"
          >
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-600">
                  {company?.name ?? post.resourceUid}
                </span>
                <span className="text-xs text-gray-400">{post.dateTime}</span>
              </div>
              <p className="text-sm font-semibold text-gray-800 leading-snug">{post.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{post.content}</p>
            </div>
            <div className="flex items-center shrink-0 mt-1 text-gray-300 group-hover:text-gray-400 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
