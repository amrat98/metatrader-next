import React from "react";
import {
  FacebookShareButton, FacebookIcon,
  TwitterShareButton, TwitterIcon,
  WhatsappShareButton, WhatsappIcon,
  TelegramShareButton, TelegramIcon,
  LinkedinShareButton, LinkedinIcon,
  RedditShareButton, RedditIcon,
  PinterestShareButton, PinterestIcon,
  EmailShareButton, EmailIcon,
} from "next-share";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type SharePopupProps = {
  open: boolean;
  onClose: () => void;
  link: string;
  title?: string;
  description?: string;
};

export const SharePopup: React.FC<SharePopupProps> = ({
  open,
  onClose,
  link,
  title,
  description,
}) => (
  <Dialog open={open} onOpenChange={onClose} >
    <DialogContent className="max-w-md bg-card">
      <DialogTitle>Share this link</DialogTitle>
      <div className="flex flex-wrap gap-4 py-4 justify-center">
        <div className="flex flex-col items-center gap-1 px-2 py-1">
          <FacebookShareButton url={link} quote={title}>
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <span className="block text-xs mt-1">Facebook</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-1">
          <TwitterShareButton url={link} title={title}>
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <span className="block text-xs mt-1">Twitter</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-1">
          <WhatsappShareButton url={link} title={title}>
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
          <span className="block text-xs mt-1">WhatsApp</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-1">
          <TelegramShareButton url={link} title={title}>
            <TelegramIcon size={40} round />
          </TelegramShareButton>
          <span className="block text-xs mt-1">Telegram</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-1">
          <LinkedinShareButton url={link} title={title} summary={description}>
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <span className="block text-xs mt-1">LinkedIn</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-1">
          <RedditShareButton url={link} title={title}>
            <RedditIcon size={40} round />
          </RedditShareButton>
          <span className="block text-xs mt-1">Reddit</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-1">
          <PinterestShareButton url={link} media={link}>
            <PinterestIcon size={40} round />
          </PinterestShareButton>
          <span className="block text-xs mt-1">Pinterest</span>
        </div>
        <div className="flex flex-col items-center gap-1 px-2 py-1">
          <EmailShareButton url={link} subject={title} body={description}>
            <EmailIcon size={40} round />
          </EmailShareButton>
          <span className="block text-xs mt-1">Email</span>
        </div>
      </div>
      <div className="flex justify-end">
        <DialogClose asChild>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
);

export default SharePopup; 