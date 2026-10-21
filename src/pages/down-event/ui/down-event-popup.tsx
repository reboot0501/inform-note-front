// src/pages/down-event/ui/down-event-popup.tsx
import { useEffect, useState, useRef } from 'react';
import dayjs from 'dayjs';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  X, 
  AlertTriangle, 
  Loader2, 
  Save, 
  RotateCcw,
  UserCheck,
  PackagePlus
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { openImageViewerWindow } from '@/shared/lib/image-viewer-popup';
import { findActionPopupApi } from '@/features/action-popup-seach';
import { correctiveActionApi, type CorrectiveActionCommand } from '@/features/corrective-action-save';
import { TechnicianSelectDrawer } from '@/features/technician-select';
import { ReplacePartDrawer } from '@/features/replace-part';
import { registerTempFileApi, getFileViewUrl } from '@/features/editor-file-upload';
import type { DownEventCard } from '@/entities/down-event-card/model/down-event-card.entity';
import type { WorkStatus } from '@/entities/down-event-card/model/vo/work-status.enum';
import type { AssignedTechnician } from '@/entities/down-event-card/model/vo/assigned-technician.vo';
import type { ExtractEmployee } from '@/entities/employees/model';
import type { PartReplacement } from '@/entities/down-event-card/model/vo/part-replacement.vo';

import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins.pkgd.min.js';
import FroalaEditor from 'froala-editor';

/** Froala 커스텀 커맨드 & 아이콘 등록 */
const registerFroalaCommands = () => {
  if (typeof window === 'undefined') return;
  const Editor = (FroalaEditor as any)?.default || FroalaEditor;
  if (!Editor || !Editor.DefineIcon) return;
  if ((Editor as any).__informNoteCommandsRegistered) {
    return;
  }
  (Editor as any).__informNoteCommandsRegistered = true;

  Editor.DefineIcon('imageInspect', { NAME: 'search-plus', SVG_KEY: 'fullscreen' });
  Editor.RegisterCommand('imageInspect', {
    title: '이미지 정밀 확대 검사 (윈도우 팝업)',
    undo: false,
    focus: false,
    refreshAfterCallback: false,
    callback: function (this: any) {
      const $img = this.image.get();
      if ($img && ($img as any).length > 0) {
        const src = ($img as any).attr('src');
        const alt = ($img as any).attr('alt') || '현상 및 조치 상세 이미지';
        if (src) {
          openImageViewerWindow(src, alt);
        }
      }
    },
  });

  Editor.DefineIcon('insertTemplateLR', { NAME: 'layout-lr', SVG_KEY: 'insertTable' });
  Editor.RegisterCommand('insertTemplateLR', {
    title: '좌우 템플릿 (현상 vs 조치)',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback: function (this: any) {
      this.html.insert(`
        <table class="rpt-table rpt-lr-table" style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0; margin: 10px 0; border-radius: 8px; overflow: hidden;">
          <tbody>
            <tr>
              <td style="width: 50%; vertical-align: top; border-right: 1px solid #e2e8f0; padding: 14px; background-color: #fffbeb;">
                <div style="display: flex; align-items: center; gap: 6px; font-weight: bold; color: #b45309; margin-bottom: 8px;">
                   <span>⚠️</span>
                   <h4 style="margin:0; font-size: 13px;">발생 현상 (Symptom)</h4>
                </div>
                <p style="margin: 4px 0; font-size: 12px; color: #334155;">현상에 대한 상세 수치 및 알람 내용을 입력하세요.</p>
                <br>
              </td>
              <td style="width: 50%; vertical-align: top; padding: 14px; background-color: #eff6ff;">
                <div style="display: flex; align-items: center; gap: 6px; font-weight: bold; color: #1d4ed8; margin-bottom: 8px;">
                   <span>✔</span>
                   <h4 style="margin:0; font-size: 13px;">조치 내용 (Action Taken)</h4>
                </div>
                <p style="margin: 4px 0; font-size: 12px; color: #334155;">교체된 부품 및 파라미터 최적화 조치 내역을 입력하세요.</p>
                <br>
              </td>
            </tr>
          </tbody>
        </table><p><br></p>
      `);
    },
  });

  Editor.DefineIcon('insertTemplateTB', { NAME: 'layout-tb', SVG_KEY: 'paragraphStyle' });
  Editor.RegisterCommand('insertTemplateTB', {
    title: '상하 템플릿 (종합 보고서)',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback: function (this: any) {
      this.html.insert(`
        <div style="border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 10px 0; background-color: #f8fafc;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px;">
            <h4 style="margin:0; font-size: 14px; font-weight: bold; color: #0f172a;">고장 분석 및 조치 보고서</h4>
            <span style="font-size: 10px; font-weight: bold; color: #2563eb; background-color: #dbeafe; padding: 2px 6px; border-radius: 4px;">REPORT</span>
          </div>
          <div>
            <div style="font-weight: bold; color: #334155; font-size: 12px; margin-bottom: 4px;">▶ 발생 현상</div>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #475569;">현상에 대한 상세 내용을 서술하세요.</p>
            
            <div style="font-weight: bold; color: #334155; font-size: 12px; margin-bottom: 4px;">▶ 원인 분석</div>
            <ul style="margin: 0 0 10px 18px; font-size: 12px; color: #475569; padding: 0;">
              <li>원인 1: </li>
              <li>원인 2: </li>
            </ul>
            
            <div style="font-weight: bold; color: #334155; font-size: 12px; margin-bottom: 4px;">▶ 조치 내용 및 검증 결과</div>
            <p style="margin: 0 0 10px 0; font-size: 12px; color: #475569;">조치된 상세 내역과 검증 Spec In 여부를 기록하세요.</p>
          </div>
        </div><p><br></p>
      `);
    },
  });

  Editor.DefineIcon('tableCellBackground', {
    template: 'svgMultiplePath',
    viewBox: '0 0 24 24',
    PATHS: '<path d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10l4.5-4.5 4.5 4.5H5.21z" fill="#333333"/><path d="M21.71 11.29l-3-3a1.003 1.003 0 00-1.42 0l-1.59 1.59 4.42 4.42 1.59-1.59c.39-.39.39-1.03 0-1.42z" fill="#333333"/><path d="M0 20h24v4H0z" fill="#1a73e8"/>',
  });

  Editor.RegisterCommand('tableCellBackground', {
    title: '셀 배경색 지정',
    type: 'dropdown',
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    html: function () {
      const palette = [
        ['#FFFFFF', '#F8F9FA', '#F1F3F4', '#E8EAED', '#DADCE0', '#9AA0A6', '#5F6368', '#202124'],
        ['#FCE8E6', '#FAD2CF', '#F28B82', '#EA4335', '#D93025', '#C5221F', '#B31412', '#8C1D18'],
        ['#FEF7E0', '#FEEFC3', '#FDD663', '#FBBC04', '#F29900', '#E37400', '#B06000', '#804200'],
        ['#E6F4EA', '#CEEAD6', '#81C995', '#34A853', '#1E8E3E', '#188038', '#137333', '#0D652D'],
        ['#E8F0FE', '#D2E3FC', '#8AB4F8', '#4285F4', '#1A73E8', '#1967D2', '#174EA6', '#123C82'],
        ['#F3E8FD', '#E9D2FD', '#C58AF9', '#AF5CF7', '#9334E6', '#8430CE', '#7627BB', '#5B1F96'],
        ['#FCEFE3', '#FEDFC8', '#FCAD70', '#FA7B17', '#E8710A', '#D56000', '#B55000', '#8C3B00'],
      ];

      let html = '<div class="fr-cell-color-dropdown" style="padding: 10px; width: 236px; box-sizing: border-box;">';
      html += '<div style="font-size: 11px; font-weight: 700; color: #475569; margin-bottom: 8px;">셀 배경 색상 선택</div>';
      html += '<div style="display: grid; grid-template-columns: repeat(8, 1fr); gap: 4px; margin-bottom: 10px;">';
      for (let r = 0; r < palette.length; r++) {
        for (let c = 0; c < palette[r].length; c++) {
          const color = palette[r][c];
          const isLight = color === '#FFFFFF' || color === '#F8F9FA' || color === '#F1F3F4';
          const borderStyle = isLight ? 'border: 1px solid #cbd5e1;' : 'border: 1px solid transparent;';
          html += `<a class="fr-command" role="button" tabIndex="-1" data-cmd="tableCellBackground" data-param1="${color}" title="${color}" style="width: 22px; height: 22px; background-color: ${color}; border-radius: 3px; cursor: pointer; ${borderStyle} padding: 0; display: inline-block; box-sizing: border-box;"></a>`;
        }
      }
      html += '</div>';
      html += '<a class="fr-command" role="button" tabIndex="-1" data-cmd="tableCellBackground" data-param1="REMOVE" title="배경색 제거" style="display: flex; align-items: center; justify-content: center; width: 100%; padding: 6px 0; font-size: 12px; font-weight: 600; color: #dc2626; background-color: #fee2e2; border-radius: 4px; text-decoration: none; cursor: pointer; border: 1px solid #fca5a5; box-sizing: border-box;">';
      html += '<span>✕ 배경색 제거 (초기화)</span>';
      html += '</a></div>';
      return html;
    },
    callback: function (this: any, val: string) {
      if (!val) return;
      let $cells = this.$el.find('.fr-selected-cell');
      if ($cells.length === 0) {
        const el = this.selection.element();
        const $td = this.$(el).closest('td, th');
        if ($td.length > 0) $cells = $td;
      }
      if ($cells.length > 0) {
        if (val === 'REMOVE') {
          $cells.css('background-color', '');
          $cells.each((event: any) => {
            (event.target as HTMLElement).style.removeProperty('background-color');
          });
        } else {
          $cells.css('background-color', val);
        }
        this.events.trigger('contentChanged', [], false);
      }
    },
  });

  Editor.DefineIcon('clearContent', { NAME: 'trash', SVG_KEY: 'remove' });
  Editor.RegisterCommand('clearContent', {
    title: '내용 모두 지우기',
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    callback: function (this: any) {
      if (window.confirm('작성된 모든 내용을 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다)')) {
        this.events.trigger('contentChanged', [], false);
        this.html.set('');
        this.events.trigger('contentChanged', [], false);
      }
    },
  });

  // 셀 가로(수평) 분할
  Editor.DefineIcon('splitCellHorizontal', { NAME: 'split-h', SVG_KEY: 'tableSplitCellHorizontally' });
  Editor.RegisterCommand('splitCellHorizontal', {
    title: '셀 가로(수평) 분할',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback: function (this: any) {
      if (this.table && typeof this.table.splitCellHorizontally === 'function') {
        this.table.splitCellHorizontally();
      }
    },
  });

  // 셀 세로(수직) 분할
  Editor.DefineIcon('splitCellVertical', { NAME: 'split-v', SVG_KEY: 'tableSplitCellVertically' });
  Editor.RegisterCommand('splitCellVertical', {
    title: '셀 세로(수직) 분할',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback: function (this: any) {
      if (this.table && typeof this.table.splitCellVertically === 'function') {
        this.table.splitCellVertically();
      }
    },
  });

  // 셀 병합
  Editor.DefineIcon('mergeCells', { NAME: 'merge-cells', SVG_KEY: 'tableCells' });
  Editor.RegisterCommand('mergeCells', {
    title: '셀 병합',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback: function (this: any) {
      if (this.table && typeof this.table.mergeCells === 'function') {
        this.table.mergeCells();
      }
    },
  });
};

// 모듈 로드 시 커맨드 즉시 등록
registerFroalaCommands();

export interface DownEventPopupProps {
  isOpen: boolean;
  onClose: () => void;
  item: DownEventCard | null;
  onSaveSuccess?: () => Promise<void> | void;
}

export function DownEventPopup({
  isOpen,
  onClose,
  item,
  onSaveSuccess,
}: DownEventPopupProps) {
  const [workStatus, setWorkStatus] = useState<WorkStatus>('IN_PROGRESS');
  const [contentHtml, setContentHtml] = useState<string>('');
  const [assignedTechnician, setAssignedTechnician] = useState<AssignedTechnician | null>(null);
  const [isTechnicianDrawerOpen, setIsTechnicianDrawerOpen] = useState(false);
  const [partReplacements, setPartReplacements] = useState<PartReplacement[] | null>(null);
  const [isPartDrawerOpen, setIsPartDrawerOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const editorElementRef = useRef<HTMLDivElement | null>(null);
  const froalaInstanceRef = useRef<any>(null);
  const initialHtmlRef = useRef<string>('');

  // [이유] Froala 에디터 인스턴스 초기화 시 등록되는 이벤트 핸들러(image.beforeUpload) 클로저 내에서
  // 오래된(Stale) 상태가 아닌 사용자가 선택한 최신 작업자/카드 상태를 참조하기 위해 Ref로 관리합니다.
  const assignedTechnicianRef = useRef<AssignedTechnician | null>(assignedTechnician);
  const itemRef = useRef<DownEventCard | null>(item);

  useEffect(() => {
    assignedTechnicianRef.current = assignedTechnician;
  }, [assignedTechnician]);

  useEffect(() => {
    itemRef.current = item;
  }, [item]);

  const {
    data: popupData,
    isLoading: isLoadingDetail,
    isFetching: isFetchingDetail,
    isError: isDetailError,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: ['action-popup-detail', item?.downEventId],
    queryFn: async () => {
      if (!item?.downEventId) throw new Error('이벤트 ID가 없습니다.');
      return await findActionPopupApi({ downEventId: item.downEventId });
    },
    enabled: isOpen && !!item?.downEventId,
    staleTime: 0,
  });

  const saveMutation = useMutation({
    mutationFn: async (command: CorrectiveActionCommand) => {
      return await correctiveActionApi(command);
    },
    onSuccess: async () => {
      await refetchDetail();
      await onSaveSuccess?.();
      setSuccessMessage('저장 완료되었습니다. 최신 데이터가 반영되었습니다.');
      setTimeout(() => setSuccessMessage(null), 3000);
    },
    onError: (err: any) => {
      setErrorMessage(err?.message || '저장 처리 중 오류가 발생했습니다.');
    },
  });

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setIsTechnicianDrawerOpen(false);
      setIsPartDrawerOpen(false);
    }
  }, [isOpen]);

  // Froala 에디터 네이티브 인스턴스 초기화 및 생명주기 관리
  useEffect(() => {
    if (!isOpen || !item) return;

    registerFroalaCommands();
    const Editor = (FroalaEditor as any)?.default || FroalaEditor;

    let isMounted = true;
    let timerId: any = null;

    // DOM 렌더 완료 후 인스턴스화
    timerId = setTimeout(() => {
      if (!isMounted || !editorElementRef.current) return;

      if (froalaInstanceRef.current) {
        try {
          froalaInstanceRef.current.destroy();
        } catch (e) {}
        froalaInstanceRef.current = null;
      }

      try {
        const instance = new Editor(editorElementRef.current, {
          placeholderText: '현상 및 조치 상세 내역을 입력하세요...',
          charCounterCount: false,
          heightMin: 380,
          heightMax: 560,
          toolbarButtons: [
            'bold', 'italic', 'underline', 'strikeThrough', 'textColor', 'backgroundColor', '|',
            'alignLeft', 'alignCenter', 'alignRight', 'formatOL', 'formatUL', '|',
            'insertTemplateLR', 'insertTemplateTB', '|',
            'insertTable', 'tableRows', 'tableColumns', 'mergeCells', 'splitCellHorizontal', 'splitCellVertical', 'tableCellBackground', 'tableCellStyle', 'tableRemove', '|',
            'specialCharacters', 'insertImage', '|',
            'clearContent', 'undo', 'redo', 'html'
          ],
          tableEditButtons: [
            'tableHeader', 'tableRemove', '|',
            'tableRows', 'tableColumns', 'tableStyle', '-',
            'tableCells', 'mergeCells', 'splitCellHorizontal', 'splitCellVertical', '|',
            'tableCellBackground', 'tableCellVerticalAlign', 'tableCellStyle'
          ],
          tableCellStyles: {
            'fr-highlighted': '하이라이트',
            'fr-thick': '굵은 테두리',
          },
          tableStyles: {
            'fr-dashed-borders': '점선 테두리',
            'fr-alternate-rows': '교차 행 배경색',
          },
          events: {
            initialized: function () {
              const html = initialHtmlRef.current || '';
              if (instance?.html?.set) {
                instance.html.set(html);
              }
            },
            contentChanged: function () {
              if (instance?.html?.get) {
                const current = instance.html.get();
                setContentHtml(current);
              }
            },

            /**
             * [이미지 파일 업로드 가로채기 핸들러 추가 이유]
             * 
             * 1. Froala 기본 데모 서버 업로드 차단:
             *    - Froala 에디터는 업로드 핸들러가 없으면 자체 기본값인 'https://i.froala.com/upload'로 전송을 시도하며,
             *      그 결과 데모용 샘플 이미지인 'https://i.froala.com/assets/photo1.jpg'가 본문에 박히는 문제가 발생합니다.
             *    - 핸들러 끝에서 'return false;'를 반환하여 이 기본 데모 동작을 완벽히 차단합니다.
             * 
             * 2. 프로젝트 백엔드 파일 등록 API(/feature/file-handler/register-temp-file/command) 연동:
             *    - 에디터에 드래그&드롭되거나 파일 선택기로 선택된 실제 이미지 파일을 우리 백엔드로 업로드하여
             *      서버 물리 디스크 스토리지에 안전하게 저장합니다.
             * 
             * 3. 백엔드 필수 식별자(data-file-id, data-name) 및 인라인 뷰 URL(src) 주입:
             *    - 백엔드가 발행한 UUID(fileId)를 기반으로 'data-file-id' 속성과 '/feature/file-handler/view/{fileId}'를
             *      <img> 태그에 함께 주입하여 삽입합니다.
             *    - 이렇게 해야 추후 본문 저장 시 백엔드의 FileHandlerUtils.extractFileKeysFromHtml()에서 파일 키를 정상 추출하여
             *      영구 저장(FileStatus.SAVED) 처리를 성공적으로 수행할 수 있습니다.
             */
            'image.beforeUpload': function (this: any, images: any) {
              if (!images || images.length === 0) {
                return false;
              }

              const file = images[0];
              const editor = this;

              // 작업자 정보 획득 (Ref를 통해 최신 할당 정보 참조, 미선택 시 기본 시스템 정보 적용)
              const currentTech: AssignedTechnician = assignedTechnicianRef.current || itemRef.current?.assignedTechnician || {
                empNo: itemRef.current?.createdBy || 'SYSTEM',
                name: itemRef.current?.createdBy || 'SYSTEM',
                jobTitle: '엔지니어',
                shift: 'A',
              };

              // 백엔드 임시 첨부파일 등록 API 호출
              registerTempFileApi({
                file,
                refType: 'DOWN_ATTACHMENT',
                assignedTechnician: currentTech,
                refId: itemRef.current?.downEventId,
              })
                .then((res) => {
                  // 백엔드 파일 인라인 조회 URL 생성 (/feature/file-handler/view/{fileId})
                  const viewUrl = getFileViewUrl(res.fileId);

                  // 백엔드가 발행한 viewUrl과 식별자(data-file-id)를 포함하여 에디터 본문에 <img> 태그 삽입
                  editor.image.insert(
                    viewUrl,
                    null,
                    {
                      'data-file-id': res.fileId,
                      'data-name': file.name,
                      alt: file.name,
                    },
                    editor.image.get()
                  );
                })
                .catch((err) => {
                  console.error('에디터 이미지 업로드 실패:', err);
                  setErrorMessage('이미지 업로드에 실패했습니다. 파일 형식이나 용량을 확인해 주세요.');
                });

              // ⚠️ 매우 중요: Froala 기본 데모 서버(i.froala.com)로의 자동 업로드 전송을 차단하기 위해 false 반환
              return false;
            },
          },
        });

        froalaInstanceRef.current = instance;
      } catch (err) {
        console.error('Froala Editor 초기화 실패:', err);
      }
    }, 50);

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
      if (froalaInstanceRef.current) {
        try {
          froalaInstanceRef.current.destroy();
        } catch (e) {}
        froalaInstanceRef.current = null;
      }
    };
  }, [isOpen, item?.downEventId]);

  useEffect(() => {
    if (popupData) {
      setWorkStatus(popupData.workStatus || 'IN_PROGRESS');
      setAssignedTechnician(popupData.assignedTechnician || null);
      setPartReplacements(popupData.partReplacements || []);
      const html = popupData.contentHtml || '';
      setContentHtml(html);
      initialHtmlRef.current = html;
      if (froalaInstanceRef.current?.html?.set) {
        froalaInstanceRef.current.html.set(html);
      }
    } else if (item) {
      setWorkStatus(item.workStatus || 'IN_PROGRESS');
      setAssignedTechnician(item.assignedTechnician || null);
      setPartReplacements(item.partReplacements || []);
      const fallbackHtml = (item as any).contentHtml || '';
      setContentHtml(fallbackHtml);
      initialHtmlRef.current = fallbackHtml;
      if (froalaInstanceRef.current?.html?.set) {
        froalaInstanceRef.current.html.set(fallbackHtml);
      }
    }
  }, [popupData, item]);

  if (!isOpen || !item) return null;

  const displayItem = popupData || item;
  const currentTechnician = assignedTechnician || displayItem.assignedTechnician;
  const currentParts = partReplacements !== null ? partReplacements : (displayItem.partReplacements || []);

  const handleSelectTechnician = (tech: ExtractEmployee) => {
    const newTech: AssignedTechnician = {
      empNo: tech.empNo,
      name: tech.name,
      jobTitle: tech.jobTitle,
      shift: tech.shift,
    };
    setAssignedTechnician(newTech);
    setIsTechnicianDrawerOpen(false);
    setSuccessMessage(`보전 작업자가 [${tech.name} ${tech.jobTitle}] 님으로 변경되었습니다.`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const partsText =
    currentParts && currentParts.length > 0
      ? currentParts.map((p) => `${p.partName} (P/N: ${p.partNo}) ×${p.qty}`).join(' / ')
      : '교체 내역 없음';

  const durationText = displayItem.downDurationMinutes
    ? `${Math.floor(displayItem.downDurationMinutes / 60)}시간 ${displayItem.downDurationMinutes % 60}분`
    : '진행중';

  const startTimeText = displayItem.downStartDatetime
    ? dayjs(displayItem.downStartDatetime).format('YYYY-MM-DD HH:mm:ss')
    : '-';
  const endTimeText = displayItem.downEndDatetime
    ? dayjs(displayItem.downEndDatetime).format('YYYY-MM-DD HH:mm:ss')
    : '진행중';

  const handleSave = () => {
    const currentHtml = froalaInstanceRef.current?.html?.get
      ? froalaInstanceRef.current.html.get()
      : contentHtml;
    const isStatusChanged = workStatus !== displayItem.workStatus;
    const isContentChanged = currentHtml.trim() !== initialHtmlRef.current.trim();
    const isTechChanged = assignedTechnician?.empNo !== displayItem.assignedTechnician?.empNo;
    const isPartsChanged = JSON.stringify(currentParts) !== JSON.stringify(displayItem.partReplacements || []);

    if (!isStatusChanged && !isContentChanged && !isTechChanged && !isPartsChanged) {
      setErrorMessage('변경 저장할 데이터가 없습니다.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    const command: CorrectiveActionCommand = {
      downEventId: displayItem.downEventId,
      assignedTechnician: assignedTechnician || displayItem.assignedTechnician || {
        empNo: 'TECH-DEFAULT',
        name: '현장 작업자',
        jobTitle: '엔지니어',
        shift: 'A',
      },
      partReplacements: currentParts,
      contentHtml: currentHtml,
      workStatus,
    };

    saveMutation.mutate(command);
  };

  const isSaving = saveMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-200">
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-[1500px] flex flex-col max-h-[92vh] overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-4.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              현상 및 조치 상세 관리
              <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                #{displayItem.downEventId}
              </span>
            </h2>
            {isLoadingDetail && (
              <span className="inline-flex items-center gap-1 text-xs text-purple-600 font-medium ml-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> 상세 조회 중...
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchDetail()}
              disabled={isFetchingDetail}
              className="h-7 px-2.5 text-xs gap-1"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isFetchingDetail ? 'animate-spin' : ''}`} />
              새로고침
            </Button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
          <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <table className="w-full text-xs text-left border-collapse bg-white dark:bg-slate-900">
              <tbody>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/6 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">
                    장비 ID / Chamber
                  </th>
                  <td className="py-2.5 px-4 w-2/6 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                    {displayItem.equipmentId} / {displayItem.chamberId}
                  </td>
                  <th className="py-2.5 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/6 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">
                    Down 발생 / 복구 일시
                  </th>
                  <td className="py-2.5 px-4 w-2/6 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                    {startTimeText} ~ {endTimeText}
                  </td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/6 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">
                    Down 코드 / 알람
                  </th>
                  <td colSpan={3} className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-indigo-700 dark:text-indigo-400">{displayItem.downCode}</span>
                      {displayItem.downCodeDescription && <span>({displayItem.downCodeDescription})</span>}
                      {displayItem.alarmId && (
                        <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] ml-2">
                          Alarm ID: {displayItem.alarmId}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="py-2.5 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/6 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">
                    Down 시간 (총 소요)
                  </th>
                  <td className="py-2.5 px-4 w-2/6 font-semibold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span>{durationText}</span>
                      {(displayItem.isCritical ?? (displayItem as any).critical) && (
                        <Badge variant="destructive" className="h-5 text-[10px] font-bold">
                          CRITICAL
                        </Badge>
                      )}
                    </div>
                  </td>
                  <th className="py-2.5 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/6 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-1">
                      <span>보전 작업자 / 승인자</span>
                      {(workStatus === 'DOWN_OCCURRED' || workStatus === 'IN_PROGRESS') && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsTechnicianDrawerOpen(true)}
                          className="h-6 px-2 text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 shadow-2xs gap-1 transition-all"
                        >
                          <UserCheck className="w-3 h-3" />
                          작업자선택
                        </Button>
                      )}
                    </div>
                  </th>
                  <td className="py-2.5 px-4 w-2/6 text-slate-700 dark:text-slate-300">
                    <span>
                      <strong className="font-semibold text-slate-900 dark:text-slate-100">[작업]</strong>{' '}
                      {currentTechnician ? (
                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                          {currentTechnician.name} {currentTechnician.jobTitle || ''}
                        </span>
                      ) : (
                        '-'
                      )}
                    </span>
                    <span className="ml-3">
                      <strong className="font-semibold text-slate-900 dark:text-slate-100">[승인]</strong>{' '}
                      {displayItem.approver && displayItem.approver.name ? `${displayItem.approver.name} ${displayItem.approver.jobTitle || ''}` : <span className="text-slate-400">미승인</span>}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th className="py-2.5 px-4 font-semibold text-slate-600 dark:text-slate-400 w-1/6 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between gap-1">
                      <span>교체 부품 / 사용 자재</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPartDrawerOpen(true)}
                        className="h-6 px-2 text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 shadow-2xs gap-1 transition-all"
                      >
                        <PackagePlus className="w-3 h-3" />
                        등록
                      </Button>
                    </div>
                  </th>
                  <td colSpan={3} className="py-2.5 px-4 text-slate-800 dark:text-slate-200">
                    {partsText}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✔</span>
              <span>{successMessage}</span>
            </div>
          )}

          {(errorMessage || isDetailError) && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{errorMessage || (detailError as Error)?.message || '오류 발생'}</span>
              </div>
              {isDetailError && (
                <Button variant="outline" size="sm" onClick={() => refetchDetail()} className="h-7 text-xs gap-1">
                  <RotateCcw className="w-3 h-3" /> 다시 시도
                </Button>
              )}
            </div>
          )}

          <div className="flex-1 flex flex-col min-h-[440px] border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
            <div ref={editorElementRef} className="w-full h-full" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">진행 상태 변경:</label>
            <select
              value={workStatus}
              onChange={(e) => setWorkStatus(e.target.value as WorkStatus)}
              className="h-8 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 text-xs bg-white dark:bg-slate-900 font-semibold"
            >
              <option value="DOWN_OCCURRED">DOWN_OCCURRED (다운발생)</option>
              <option value="IN_PROGRESS">IN_PROGRESS (조치중)</option>
              <option value="ACTION_DONE">ACTION_DONE (조치완료)</option>
              <option value="VERIFIED">VERIFIED (검증완료)</option>
              <option value="CLOSED">CLOSED (종료)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isSaving} className="h-8 text-xs px-3">취소</Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving || isLoadingDetail}
              className="h-8 text-xs px-3.5 gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
            >
              {isSaving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> 저장 중...</> : <><Save className="w-3.5 h-3.5" /> 저장</>}
            </Button>
          </div>
        </div>

        {/* 4. 작업자 선택용 분리 컴포넌트 호출 (TechnicianSelectDrawer - 우측 슬라이딩) */}
        <TechnicianSelectDrawer
          isOpen={isTechnicianDrawerOpen}
          onClose={() => setIsTechnicianDrawerOpen(false)}
          currentEmpNo={currentTechnician?.empNo}
          currentName={currentTechnician?.name}
          onSelectTechnician={handleSelectTechnician}
        />

        {/* 5. 교체 부품 및 사용 자재 등록 Drawer (ReplacePartDrawer - 좌측 슬라이딩) */}
        <ReplacePartDrawer
          isOpen={isPartDrawerOpen}
          onClose={() => setIsPartDrawerOpen(false)}
          initialItems={currentParts}
          onSave={(newItems) => {
            setPartReplacements(newItems);
            setSuccessMessage(`교체 부품 및 사용 자재가 ${newItems.length}건으로 업데이트되었습니다.`);
            setTimeout(() => setSuccessMessage(null), 3000);
          }}
        />
      </div>
    </div>
  );
}
