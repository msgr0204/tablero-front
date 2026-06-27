const VARIANTS = {
  primary:
    'bg-segundo text-primero-oscuro hover:bg-segundo-claro shadow-[0_0.5rem_1.5rem_-0.5rem_var(--tw-shadow-color)] shadow-segundo/40 active:scale-[0.98]',
  ghost:
    'bg-transparent text-cuarto/70 border border-cuarto/15 hover:border-cuarto/30 hover:text-cuarto active:scale-[0.98]',
  danger:
    'bg-quinto/15 text-quinto-claro border border-quinto/30 hover:bg-quinto/25 active:scale-[0.98]',
};

function Button({ variant = 'primary', loading = false, disabled = false, children, className = '', ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'relative w-full h-[2.875em] rounded-[0.75em] font-poppins font-semibold text-[0.95em]',
        'transition-all duration-200 ease-out',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-segundo/50 focus-visible:ring-offset-2 focus-visible:ring-offset-primero-fuerte',
        VARIANTS[variant],
        className,
      ].join(' ')}
      {...props}
    >
      <span className={`flex items-center justify-center gap-[0.5em] transition-opacity duration-150 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-[1.1em] h-[1.1em] rounded-full border-[0.15em] border-current/30 border-t-current animate-spin" />
        </span>
      )}
    </button>
  );
}

export default Button;
