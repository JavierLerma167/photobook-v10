import { Project, PreflightIssue, AlbumSize, PrintProfile } from '@/src/types';
import { computeEffectiveDpi } from './resolution';
import { nanoid } from 'nanoid';

export function runPreflight(project: Project, size: AlbumSize, profile: PrintProfile): PreflightIssue[] {
  const issues: PreflightIssue[] = [];
  const usedPhotoIds = new Set<string>();

  project.pages.forEach(page => {
    const isCover = page.kind === 'cover';

    page.slots.forEach(slot => {
      if (!slot.photoId) {
        issues.push({
          id: nanoid(8),
          level: 'warning',
          pageId: page.id,
          slotId: slot.id,
          message: `Slot vacío en ${isCover ? 'portada' : 'página'}`,
          category: 'Slot'
        });
      } else {
        usedPhotoIds.add(slot.photoId);
        const photo = project.photos.find(p => p.id === slot.photoId);
        if (!photo) {
          issues.push({
            id: nanoid(8),
            level: 'error',
            pageId: page.id,
            slotId: slot.id,
            message: 'Fotografía faltante',
            category: 'Media'
          });
        } else {
          const info = computeEffectiveDpi(photo, slot, size, profile.dpi);
          if (info.level === 'critical' || info.level === 'warning') {
            issues.push({
              id: nanoid(8),
              level: info.level === 'critical' ? 'error' : 'warning',
              pageId: page.id,
              slotId: slot.id,
              message: `${photo.name}: ${info.effectiveDpi} DPI (requiere ${info.requiredDpi})`,
              category: 'Resolución'
            });
          }

          if (!isCover) {
            const gutterLeft = 50 - (size.gutterIn / (size.widthIn * 2)) * 100;
            const gutterRight = 50 + (size.gutterIn / (size.widthIn * 2)) * 100;
            const crossesGutter =
              (slot.x < gutterLeft && slot.x + slot.w > gutterRight) ||
              (slot.x < gutterLeft && slot.x + slot.w > gutterLeft && slot.x + slot.w < gutterRight) ||
              (slot.x > gutterLeft && slot.x < gutterRight);
            if (crossesGutter && slot.w > 30) {
              issues.push({
                id: nanoid(8),
                level: 'warning',
                pageId: page.id,
                slotId: slot.id,
                message: 'Foto sobre el gutter (centro)',
                category: 'Encuadernación'
              });
            }
          }

          const safe = (size.safeIn / size.widthIn) * 100;
          if (slot.x < safe || slot.y < safe || slot.x + slot.w > 100 - safe || slot.y + slot.h > 100 - safe) {
            issues.push({
              id: nanoid(8),
              level: 'warning',
              pageId: page.id,
              slotId: slot.id,
              message: 'Foto fuera del área segura',
              category: 'Safe zone'
            });
          }
        }
      }
    });

    const safe = (size.safeIn / size.widthIn) * 100;
    page.texts.forEach(t => {
      if (t.x < safe || t.y < safe || t.x + t.w > 100 - safe || t.y + t.h > 100 - safe) {
        issues.push({
          id: nanoid(8),
          level: 'warning',
          pageId: page.id,
          textId: t.id,
          message: `Texto "${t.text.slice(0, 20)}" fuera de safe zone`,
          category: 'Texto'
        });
      }
    });
  });

  const unused = project.photos.filter(p => !usedPhotoIds.has(p.id));
  if (unused.length > 0 && project.photos.length > 0) {
    issues.push({
      id: nanoid(8),
      level: 'ok',
      message: `${unused.length} fotografía(s) sin usar en el álbum`,
      category: 'Media'
    });
  }

  if (issues.filter(i => i.level !== 'ok').length === 0) {
    issues.push({
      id: nanoid(8),
      level: 'ok',
      message: 'Todo listo para exportar',
      category: 'General'
    });
  }

  return issues;
}