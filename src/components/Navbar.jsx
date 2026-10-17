import ThemeToggle from './ThemeToggle';
// ...
{/* Desktop Actions */}
<div className="hidden md:flex items-center gap-3">
  <ThemeToggle />
  <button onClick={onOpenAccessibility} ...><Eye className="w-5 h-5 text-brand-600" /></button>
  {/* Profile / Auth Button */}
</div>

{/* Mobile Bar */}
<div className="flex md:hidden items-center gap-2">
  <ThemeToggle />
  <button onClick={onOpenAccessibility} ...><Eye className="w-5 h-5 text-brand-600" /></button>
  {/* Mobile Menu Button */}
</div>
