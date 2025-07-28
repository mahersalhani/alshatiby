import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const DeleteRow = () => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Default</DialogTitle>
          </DialogHeader>
          <DialogDescription className="pb-8">
            <h3 className="text-base font-medium text-default-950 my-2 mt-3">Buy me a coffe.</h3>
            <p className="text-base text-default-500 mt-2">
              We enables fans to financially support their favorite creators through donations.
            </p>
            <p className="text-base  text-default-500 mt-2">
              The platform allows supporters to make one-time or recurring contributions to their favorite creators,
              enhancing the financial stability and creative freedom of artists, writers, developers, and more.
            </p>
          </DialogDescription>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" color="warning">
                Close
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>Save</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteRow;
