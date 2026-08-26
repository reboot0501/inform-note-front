// src/features/replace-part/ui/replace-part.drawer.tsx
import { useState, useEffect } from 'react';
import { Trash2, X, PackagePlus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/lib/css-utils';
import type { PartReplacement } from '@/entities/down-event-card/model/vo/part-replacement.vo';
import type { ReplacementType } from '@/entities/down-event-card/model/vo/replacement-type.enum';

export interface ReplacePartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialItems?: PartReplacement[];
  onSave: (items: PartReplacement[]) => void;
}

export function ReplacePartDrawer({
  isOpen,
  onClose,
  initialItems = [],
  onSave,
}: ReplacePartDrawerProps) {
  const [items, setItems] = useState<PartReplacement[]>([]);
  const [replacementType, setReplacementType] = useState<ReplacementType>('REPLACEMENT_PART');
  const [partNo, setPartNo] = useState('');
  const [partName, setPartName] = useState('');
  const [qty, setQty] = useState<number>(1);
  const [inputError, setInputError] = useState<string | null>(null);

  // 드로어 열릴 때 기존 데이터 복사
  useEffect(() => {
    if (isOpen) {
      setItems([...(initialItems || [])]);
      setPartNo('');
      setPartName('');
      setQty(1);
      setInputError(null);
    }
  }, [isOpen, initialItems]);

  const handleAddItem = () => {
    const trimmedNo = partNo.trim();
    const trimmedName = partName.trim();

    if (!trimmedNo) {
      setInputError('No(부품/자재 번호)를 입력하세요.');
      return;
    }
    if (!trimmedName) {
      setInputError('Name(부품/자재 명칭)을 입력하세요.');
      return;
    }

    const newItem: PartReplacement = {
      replacementType,
      partNo: trimmedNo,
      partName: trimmedName,
      qty: qty > 0 ? qty : 1,
    };

    setItems((prev) => [...prev, newItem]);
    setPartNo('');
    setPartName('');
    setQty(1);
    setInputError(null);
  };

  const handleUpdateItem = (index: number, field: keyof PartReplacement, value: any) => {
    setItems((prev) =>
      prev.map((item, idx) => {
        if (idx === index) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    // 공백 항목 필터링 및 정제
    const cleanedItems = items
      .map((item) => ({
        ...item,
        partNo: item.partNo.trim(),
        partName: item.partName.trim(),
        qty: Number(item.qty) > 0 ? Number(item.qty) : 1,
      }))
      .filter((item) => item.partNo !== '' || item.partName !== '');

    onSave(cleanedItems);
    onClose();
  };

  return (
    <div
      className={cn(
        'absolute inset-y-0 left-0 w-full sm:w-1/2 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-40 flex flex-col transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'
      )}
    >
      {/* 1. 헤더 */}
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <PackagePlus className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          교체 부품 / 사용 자재 등록
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. 본문 */}
      <div className="p-6 flex-1 flex flex-col min-h-0 gap-4 overflow-y-auto">
        {/* 라디오 선택: Replacement Part vs Use Material */}
        <div className="flex items-center gap-8 py-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
            <input
              type="radio"
              name="replacementType"
              checked={replacementType === 'REPLACEMENT_PART'}
              onChange={() => setReplacementType('REPLACEMENT_PART')}
              className="w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
            />
            <span>Replacement Part</span>
          </label>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
            <input
              type="radio"
              name="replacementType"
              checked={replacementType === 'USE_MATERIAL'}
              onChange={() => setReplacementType('USE_MATERIAL')}
              className="w-4 h-4 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-600"
            />
            <span>Use Material</span>
          </label>
        </div>

        {/* 입력 폼: No / Name + 추가 버튼 */}
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-2">
              <Input
                value={partNo}
                onChange={(e) => {
                  setPartNo(e.target.value);
                  if (inputError) setInputError(null);
                }}
                placeholder="No"
                className="h-8.5 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
              <Input
                value={partName}
                onChange={(e) => {
                  setPartName(e.target.value);
                  if (inputError) setInputError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddItem();
                }}
                placeholder="name"
                className="h-8.5 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div className="flex flex-col justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleAddItem}
                className="h-8.5 px-6 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100"
              >
                추가
              </Button>
            </div>
          </div>

          {inputError && <span className="text-[11px] text-rose-500 font-medium">{inputError}</span>}
        </div>

        {/* 테이블 영역: 각 행 인라인 직접 수정 지원 */}
        <div className="flex-1 min-h-[220px] border border-slate-300 dark:border-slate-700 rounded-lg overflow-y-auto bg-white dark:bg-slate-900">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 sticky top-0 font-semibold z-10 border-b border-slate-300 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-2 w-[30%] border-r border-slate-300 dark:border-slate-700 text-center">Type</th>
                <th className="py-2.5 px-2 w-[24%] border-r border-slate-300 dark:border-slate-700 text-center">No</th>
                <th className="py-2.5 px-2 w-[28%] border-r border-slate-300 dark:border-slate-700 text-center">Name</th>
                <th className="py-2.5 px-1 w-[10%] border-r border-slate-300 dark:border-slate-700 text-center">Qty</th>
                <th className="py-2.5 px-1 w-[8%] text-center">
                  <Trash2 className="w-3.5 h-3.5 mx-auto text-slate-500" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {items.map((item, idx) => (
                <tr key={`${item.partNo}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                  {/* Type 컬럼: select box */}
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800">
                    <select
                      value={item.replacementType}
                      onChange={(e) => handleUpdateItem(idx, 'replacementType', e.target.value as ReplacementType)}
                      className="w-full h-7 px-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="REPLACEMENT_PART">Replacement Part</option>
                      <option value="USE_MATERIAL">Use Material</option>
                    </select>
                  </td>

                  {/* No 컬럼: text input */}
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={item.partNo}
                      onChange={(e) => handleUpdateItem(idx, 'partNo', e.target.value)}
                      placeholder="No"
                      className="w-full h-7 px-2 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </td>

                  {/* Name 컬럼: text input */}
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800">
                    <input
                      type="text"
                      value={item.partName}
                      onChange={(e) => handleUpdateItem(idx, 'partName', e.target.value)}
                      placeholder="Name"
                      className="w-full h-7 px-2 text-xs font-medium rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </td>

                  {/* Qty 컬럼: number input */}
                  <td className="p-1 border-r border-slate-200 dark:border-slate-800 text-center">
                    <input
                      type="number"
                      min={1}
                      value={item.qty || 1}
                      onChange={(e) => handleUpdateItem(idx, 'qty', Math.max(1, Number(e.target.value) || 1))}
                      className="w-full h-7 px-1 text-xs text-center font-mono rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </td>

                  {/* 삭제 버튼 */}
                  <td className="p-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors inline-flex items-center justify-center"
                      title="삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    등록된 교체 부품 및 사용 자재가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. 하단 버튼 바 */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800/60">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="h-8.5 px-8 text-xs font-semibold bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100"
        >
          닫기
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className="h-8.5 px-8 text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700"
        >
          저장
        </Button>
      </div>
    </div>
  );
}
