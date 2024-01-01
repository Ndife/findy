import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog"
import { useState } from "react"
import { Button } from "./ui/button"
import { Expand, Loader2 } from "lucide-react"
import SimpleBar from "simplebar-react"

import { Document, Page } from 'react-pdf'
import { useToast } from "./ui/use-toast"
import { useResizeDetector } from "react-resize-detector"

interface PdfFullscreenProps {
  fileUrl: string
}

const PdfFullScreen = ({ fileUrl }: PdfFullscreenProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [numPages, setNumPages] = useState<number>()

  const { toast } = useToast()
  const {width, ref } = useResizeDetector()

  return(
    <Dialog open={isOpen}
    onOpenChange={() => setIsOpen(!isOpen)}
    >
      <DialogTrigger asChild>
        <Button 
          variant='ghost' 
          className='gap-1.5' aria-label="fullscreen">
          <Expand className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      
      <DialogContent className='w-full absolute left-0 top-28'>
        <SimpleBar autoHide={false} className="max-h-100hv mt-6 z-50">
          <div ref={ref}>
              <Document loading={
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
              file={fileUrl} className="max-h-full">
                { new Array(numPages).fill(0).map((_, i) => (
                  <Page
                    key={i}
                    width={width ?? 1}
                    pageNumber={i + 1}
                  />
                ))}
              </Document>
            </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  )
}

export default PdfFullScreen