'use client'

export function DeletePageButton({title}: {title: string}) {
  return <button type="submit" className="rounded-lg border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
    onClick={event => { if (!window.confirm('“' + title + '” sayfası kalıcı olarak silinsin mi?')) event.preventDefault() }}>
    Sayfayı sil
  </button>
}
