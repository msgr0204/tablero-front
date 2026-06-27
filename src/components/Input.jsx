import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  { icon, trailing, error, className = '', ...props },
  ref
) {
  return (
    <div className="flex flex-col gap-[0.4em]">
      <div
        className={[
          'flex items-center gap-[0.6em] h-[2.875em] px-[0.95em] rounded-[0.75em]',
          'bg-primero-claro/60 border transition-all duration-200',
          error
            ? 'border-quinto/50 focus-within:border-quinto/70'
            : 'border-cuarto/10 hover:border-cuarto/20 focus-within:border-segundo/60 focus-within:bg-primero-claro',
        ].join(' ')}
      >
        {icon && <span className="text-cuarto/35 text-[0.9em] flex-shrink-0">{icon}</span>}
        <input
          ref={ref}
          className={[
            'flex-1 min-w-0 bg-transparent text-cuarto text-[0.95em] font-roboto',
            'placeholder:text-cuarto/30 outline-none',
            className,
          ].join(' ')}
          {...props}
        />
        {trailing && <span className="flex-shrink-0">{trailing}</span>}
      </div>
    </div>
  );
});

export default Input;
