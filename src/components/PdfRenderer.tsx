'use client'

import { ChevronDown, ChevronUp, Loader2, RotateCw, Search } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf'

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useToast } from './ui/use-toast';
import { useResizeDetector } from 'react-resize-detector'
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { DropdownMenuContent } from './ui/dropdown-menu';
import SimpleBar from 'simplebar-react'
import PdfFullScreen from './PdfFullScreen';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();


interface PdfRendererProps {
  url: string
}

const PdfRenderer = ({ url }: PdfRendererProps) => {
  const { toast } = useToast()

  const [numPages, setNumPages] = useState<number>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [scale, setScale] = useState<number>(1)
  const [rotation, setRotation] = useState<number>(0)
  const [renderedScale, setRenderedScale] = useState<number | null>(null)

  const isLoading = renderedScale !== scale

  const CustomPageValidator = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= numPages!)
  })

  type TCustomPageValidator = z.infer<typeof CustomPageValidator>

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<TCustomPageValidator>({
    defaultValues: {
      page: '1'
    },
    resolver: zodResolver(CustomPageValidator)
  })

  const {width, ref } = useResizeDetector()

  const handlePageSubmit = ({page}: TCustomPageValidator) => {
    setCurrentPage(Number(page))
    setValue("page", String(page))
  }

  return (
    <div className="w-full bg-white rounded-md shadown flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between -ml-2 md:ml-0 px-0 md:px-2">
        <div className="flex items-center md:gap-1.5 gap-0">
          <Button
            disabled={currentPage <= 1} 
            onClick={() => {
              setCurrentPage((prev) => 
              prev - 1 > 1 ? prev - 1 : 1)

              setValue("page", String(currentPage - 1))
            }} 
            variant='ghost' aria-label='previous page'>
            <ChevronDown className='h-4 w-4' />
          </Button>

          <div className='flex items-center gap-1.5'>
            <Input 
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(handlePageSubmit)()
                }
              }} 
              className={cn('w-12 h-8', errors.page && 'focus-visible:ring-red-500')} />
            <p className='text-zinc-700 text-sm space-x-1'>
              <span>/</span>
              <span>{numPages ?? 'x'}</span>
            </p>
          </div>

          <Button
            disabled={numPages === undefined || currentPage === numPages}
            onClick={() => {
              setCurrentPage((prev) => 
              prev + 1 > numPages! ? numPages! : prev + 1 )
              setValue("page", String(currentPage + 1))
            }} 
            variant='ghost' aria-label='previous page'>
            <ChevronUp className='h-4 w-4' />
          </Button>
        </div>

        <div className='space-x-0 md:space-x-2 flex'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='gap-1.5 focus-visible:ring-0 focus-visible:ring-transparent' aria-label='zoom' variant='ghost'>
                <Search className='h-4 w-4' />
                {scale * 100}%<ChevronDown className='h-3 w-3 opacity-50'/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onSelect={() => setScale(1)} 
                className='focus:outline-none cursor-pointer hover:bg-accent'>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setScale(1.5)} 
                className='focus:outline-none cursor-pointer hover:bg-accent'>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setScale(2)} 
                className='focus:outline-none cursor-pointer hover:bg-accent'>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setScale(2.5)} 
                className='focus:outline-none cursor-pointer hover:bg-accent'>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90 )} 
            variant='ghost' 
            arial-label='rotate 90 degrees'>
              <RotateCw className='h-4 w-4' />
          </Button>

          
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
          <div ref={ref}>
            <Document 
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='my-24 h-6 w-6 animate-spin'/>
                </div>
              }
              onLoadError={() => {
                toast({
                  title: 'Error loading PDF',
                  description: 'Please try again later',
                  variant: 'destructive',
                })
              }}
              onLoadSuccess={({numPages}) => setNumPages(numPages)}
              file={url} className="max-h-full">
                {isLoading && renderedScale ? 
                <Page 
                  width={width ? width: 1} 
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  key={'@' + renderedScale}
                /> : null}

                <Page 
                  width={width ? width: 1} 
                  pageNumber={currentPage}
                  scale={scale}
                  rotate={rotation}
                  key={'@' + scale}
                  className={cn(isLoading ? 'hidden' : '')}
                  loading={
                    <div className='flex justify-center'>
                      <Loader2 className='my-24 h-6 2-6 animate-spin'/>
                    </div>
                  }
                  onRenderSuccess={() => setRenderedScale(scale)}
                />

            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  )
}

export default PdfRenderer