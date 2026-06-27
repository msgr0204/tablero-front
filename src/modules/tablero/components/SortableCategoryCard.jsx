import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import CategoryCard from './CategoryCard';
import useIsTouchDevice from '../../../hooks/useIsTouchDevice';

function SortableCategoryCard({ category, onUpdate, onRemove, dragDisabled, autoEdit, onAutoEditDone }) {
  const isTouch = useIsTouchDevice();
  const {
    attributes, listeners, setNodeRef, setActivatorNodeRef,
    transform, transition, isDragging,
  } = useSortable({ id: category.id, disabled: dragDisabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const dragHandle = dragDisabled ? null : (
    <div
      ref={setActivatorNodeRef}
      {...attributes}
      {...listeners}
      aria-label="Arrastrar categoría"
      style={{ touchAction: 'none' }}
      className={[
        'flex items-center justify-center w-[1.75em] h-[1.75em] rounded-[0.4em]',
        'text-cuarto/30 hover:text-segundo/60 hover:bg-segundo/10',
        'transition-all duration-200 cursor-grab active:cursor-grabbing',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 flex-shrink-0',
        isTouch ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
      ].join(' ')}
    >
      <FontAwesomeIcon icon={faGripVertical} className="text-[0.75em]" />
    </div>
  );

  return (
    <div ref={setNodeRef} style={style} className="h-full">
      <CategoryCard category={category} onUpdate={onUpdate} onRemove={onRemove} dragHandle={dragHandle} autoEdit={autoEdit} onAutoEditDone={onAutoEditDone} />
    </div>
  );
}

export default SortableCategoryCard;
