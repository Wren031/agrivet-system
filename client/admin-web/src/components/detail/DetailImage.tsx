import { useState } from 'react'
import Modal from '../Modal'

interface DetailImageProps {
  src: string
  alt?: string
  label?: string
  maxHeight?: string
}

export default function DetailImage({ src, alt = 'Image', label = 'View Image', maxHeight = 'max-h-48' }: DetailImageProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div
        className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50 p-2 max-w-md cursor-pointer hover:opacity-85 transition-opacity duration-200"
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter') setShowModal(true) }}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full ${maxHeight} object-contain rounded-lg`}
          onError={e => {
            (e.target as HTMLImageElement).style.display = 'none'
            const next = (e.target as HTMLImageElement).nextElementSibling
            if (next) next.classList.remove('hidden')
          }}
        />
        <p className="hidden text-xs text-surface-500 dark:text-surface-400 py-8 text-center font-medium">
          Failed to load image
        </p>
      </div>
      <Modal open={showModal} onClose={() => setShowModal(false)} title={label} size="lg">
        <div className="flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      </Modal>
    </>
  )
}
