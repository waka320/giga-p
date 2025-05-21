"use client";

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Search, X, Book, Tag, BookOpen, RefreshCw, ExternalLink, Info } from 'lucide-react';
import CyberPsychedelicBackground from "@/components/game/CyberPsychedelicBackground";
import { ITTerm } from '@/types';

// バックエンドAPIのベースURL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function DictionaryPage() {
  const [terms, setTerms] = useState<ITTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('term');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // レスポンシブデザイン用のステート
  const [isMobile, setIsMobile] = useState(false);
  
  // 画面サイズに応じてモバイル状態を更新
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // 初期チェック
    checkScreenSize();
    
    // リサイズイベントのリスナー
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // ページネーション用の状態
  const [currentPage, setCurrentPage] = useState(1);
  // 画面サイズに応じて項目数を調整
  const itemsPerPage = useMemo(() => isMobile ? 5 : 10, [isMobile]);
  
  // データ取得
  useEffect(() => {
    const fetchTerms = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/terms`, {
          params: { search: searchQuery, sort_by: sortBy, sort_order: sortOrder }
        });
        setTerms(response.data);
      } catch (err) {
        console.error('用語取得エラー:', err);
        setError('用語データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTerms();
  }, [searchQuery, sortBy, sortOrder]);
  
  // 検索ハンドラー
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('search') as HTMLInputElement;
    setSearchQuery(input.value);
    setCurrentPage(1); // 検索時にページをリセット
  };
  
  // クリアボタンハンドラー
  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };
  
  // ソート切り替えハンドラー
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1); // ソート変更時にページをリセット
  };
  
  // 用語展開トグル
  const toggleTerm = (termId: string) => {
    setExpandedTerm(expandedTerm === termId ? null : termId);
  };
  
  // ページネーション用のフィルタリングされた用語
  const paginatedTerms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return terms.slice(startIndex, startIndex + itemsPerPage);
  }, [terms, currentPage, itemsPerPage]);
  
  // 総ページ数
  const totalPages = useMemo(() => {
    return Math.ceil(terms.length / itemsPerPage);
  }, [terms.length, itemsPerPage]);
  
  // アルファベットインデックスを生成
  const alphabetIndex = useMemo(() => {
    const index: { [key: string]: number } = {};
    terms.forEach((term, i) => {
      const firstChar = term.term.charAt(0).toUpperCase();
      if (!index[firstChar]) {
        index[firstChar] = i;
      }
    });
    return index;
  }, [terms]);
  
  // Google検索URLを生成する関数
  const getGoogleSearchUrl = (term: string, fullName: string) => {
    const query = encodeURIComponent(`${term} ${fullName} IT用語`);
    return `https://www.google.com/search?q=${query}`;
  };
  
  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen bg-zinc-900 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* サイバー背景 */}
      <CyberPsychedelicBackground />
      
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-2 md:py-4 h-full flex flex-col z-20">
        <motion.div
          className="w-full bg-black/80 border-2 border-terminal-green rounded-md p-2 sm:p-3 md:p-5 flex flex-col flex-grow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* ヘッダー - PCでは大きく */}
          <div className="flex justify-between items-center mb-2 md:mb-4">
            <h1 className="text-base sm:text-lg md:text-2xl text-terminal-green font-pixel flex items-center">
              <BookOpen className="mr-1 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" /> IT用語辞典
            </h1>
            <Link 
              href="/game/start" 
              className="text-terminal-green hover:text-terminal-green/80 flex items-center gap-1 text-xs md:text-sm"
            >
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" /> ゲームに戻る
            </Link>
          </div>
          
          {/* 検索・フィルタリング - PCでは横に広く */}
          <div className="mb-2 md:mb-4">
            <form onSubmit={handleSearch} className="flex gap-1 md:gap-2 mb-1.5 md:mb-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  name="search"
                  placeholder="用語を検索..."
                  defaultValue={searchQuery}
                  className="w-full bg-black border border-terminal-green/50 text-terminal-green py-1 md:py-2 px-1.5 pl-6 md:pl-8 text-xs md:text-base rounded-sm"
                />
                <Search className="absolute left-1.5 top-1.5 md:left-2.5 md:top-2.5 h-3 w-3 md:h-4 md:w-4 text-terminal-green/50" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-1.5 top-1.5 md:right-2.5 md:top-2.5 text-gray-400 hover:text-gray-200"
                  >
                    <X className="h-3 w-3 md:h-4 md:w-4" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-terminal-green/20 hover:bg-terminal-green/30 text-terminal-green border border-terminal-green/50 px-2 md:px-4 py-1 md:py-2 text-xs md:text-base rounded-sm"
              >
                検索
              </button>
            </form>
            
            <div className="flex gap-1.5 md:gap-3 mb-1 md:mb-3">
              <button
                onClick={() => handleSortChange('term')}
                className={`flex items-center gap-0.5 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-sm text-xs md:text-sm
                  ${sortBy === 'term' 
                    ? 'bg-terminal-green/30 text-terminal-green' 
                    : 'bg-black/50 text-gray-400 hover:bg-terminal-green/10'}`}
              >
                <Tag className="h-2.5 w-2.5 md:h-4 md:w-4" />
                略語
                {sortBy === 'term' && (
                  <span className="ml-0.5 md:ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              
              <button
                onClick={() => handleSortChange('fullName')}
                className={`flex items-center gap-0.5 md:gap-1.5 px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-sm text-xs md:text-sm
                  ${sortBy === 'fullName' 
                    ? 'bg-terminal-green/30 text-terminal-green' 
                    : 'bg-black/50 text-gray-400 hover:bg-terminal-green/10'}`}
              >
                <Book className="h-2.5 w-2.5 md:h-4 md:w-4" />
                フルネーム
                {sortBy === 'fullName' && (
                  <span className="ml-0.5 md:ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                )}
              </button>
              
              {searchQuery && (
                <div className="ml-auto text-xs md:text-sm text-gray-400">
                  &quot;{searchQuery}&quot; ({terms.length}件)
                </div>
              )}
            </div>
            
            {/* アルファベットインデックス - PCでは大きく */}
            {sortBy === 'term' && Object.keys(alphabetIndex).length > 0 && (
              <div className="overflow-x-auto whitespace-nowrap pb-1 md:pb-2">
                <div className="flex gap-px md:gap-1">
                  {Object.keys(alphabetIndex).sort().map(letter => (
                    <button
                      key={letter}
                      onClick={() => {
                        const index = Math.floor(alphabetIndex[letter] / itemsPerPage) + 1;
                        setCurrentPage(index);
                      }}
                      className="min-w-5 md:min-w-8 h-5 md:h-8 flex items-center justify-center bg-black/70 text-terminal-green hover:bg-terminal-green/20 border border-terminal-green/30 rounded-sm text-xs md:text-sm"
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* 用語リスト - PCではグリッド表示に */}
          <div className="flex-grow">
            {isLoading ? (
              <div className="text-center p-3 md:p-6">
                <motion.div
                  className="inline-block w-5 h-5 md:w-8 md:h-8 border-2 border-terminal-green border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-1 md:mt-2 text-terminal-green text-xs md:text-base">読み込み中...</p>
              </div>
            ) : error ? (
              <div className="text-center p-3 md:p-6 text-red-500 text-xs md:text-base">{error}</div>
            ) : terms.length === 0 ? (
              <div className="text-center p-3 md:p-6 text-gray-400 text-xs md:text-base">
                {searchQuery ? "検索条件に一致する用語が見つかりませんでした" : "用語が登録されていません"}
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="mt-1 md:mt-2 inline-flex items-center text-terminal-green hover:underline text-xs md:text-sm"
                  >
                    <RefreshCw className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 mr-0.5 md:mr-1" /> 検索をクリア
                  </button>
                )}
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-${isMobile ? '1' : '2'} gap-1.5 md:gap-3`}>
                {paginatedTerms.map((term, index) => (
                  <motion.div
                    key={term.term}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className={`
                      border border-terminal-green/30 rounded-sm md:rounded overflow-hidden
                      ${expandedTerm === term.term ? 'bg-terminal-green/10' : 'bg-black/50'}
                      transition-colors duration-300
                    `}
                  >
                    {/* 用語ヘッダー - PCでは大きく */}
                    <div 
                      className="flex justify-between items-center p-1.5 md:p-3 cursor-pointer hover:bg-terminal-green/5"
                      onClick={() => toggleTerm(term.term)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                          <h3 className="font-pixel text-terminal-green text-xs md:text-base">{term.term}</h3>
                          <span className="text-xs md:text-sm text-gray-400">({term.fullName})</span>
                        </div>
                      </div>
                      
                      <div className={`w-4 h-4 md:w-6 md:h-6 flex items-center justify-center text-terminal-green transition-transform ${expandedTerm === term.term ? 'rotate-180' : ''}`}>
                        <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="md:scale-125">
                          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 展開されたコンテンツ - PCでは大きく、詳細に */}
                    {expandedTerm === term.term && (
                      <div className="px-1.5 md:px-3 pb-1.5 md:pb-3 pt-0">
                        <div className="p-1.5 md:p-3 bg-black/50 rounded-sm md:rounded text-gray-300 text-xs md:text-sm">
                          {term.description}
                        </div>
                        
                        <div className="mt-1.5 md:mt-3 flex gap-1.5 md:gap-3">
                          <a 
                            href={getGoogleSearchUrl(term.term, term.fullName)}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-2xs md:text-xs px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-sm md:rounded bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 transition-colors border border-terminal-green/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Search className="h-2 w-2 md:h-3 md:w-3 mr-0.5 md:mr-1" /> 
                            Google検索
                            <ExternalLink size={8} className="ml-1 hidden md:inline" />
                          </a>
                          
                          <a 
                            href={`https://ja.wikipedia.org/wiki/${encodeURIComponent(term.fullName)}`}
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-2xs md:text-xs px-1.5 md:px-3 py-0.5 md:py-1.5 rounded-sm md:rounded bg-terminal-green/10 text-terminal-green hover:bg-terminal-green/20 transition-colors border border-terminal-green/30"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Info className="h-2 w-2 md:h-3 md:w-3 mr-0.5 md:mr-1" /> 
                            Wikipedia
                            <ExternalLink size={8} className="ml-1 hidden md:inline" />
                          </a>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* ページネーション - PCでは大きく */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 md:gap-3 py-1 md:py-3 mt-1 md:mt-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 md:px-4 py-0.5 md:py-2 bg-black border border-terminal-green/30 rounded-sm md:rounded text-terminal-green text-xs md:text-sm disabled:opacity-50"
              >
                前へ
              </button>
              
              <div className="px-2 md:px-4 py-0.5 md:py-2 bg-black/80 border border-terminal-green rounded-sm md:rounded text-terminal-green text-xs md:text-sm">
                {currentPage} / {totalPages}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2 md:px-4 py-0.5 md:py-2 bg-black border border-terminal-green/30 rounded-sm md:rounded text-terminal-green text-xs md:text-sm disabled:opacity-50"
              >
                次へ
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
