import React from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
interface Props {
  open: boolean;
  handleClose: () => void;
  title: string;
  item: string;
  keepMounted?: boolean;
}

const ServiceModal: React.FC<Props> = React.memo(({ open, handleClose, title, item, keepMounted }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      keepMounted={keepMounted}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: 'none',
          minWidth: { xs: '80%', md: '0px' },
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-title" variant="h4" component="h2">
          {title}
        </Typography>

        <Typography id="modal-description" sx={{ mt: 1 }}>
          {item.split('\n').map((line, idx) => (
            <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
              {line}
            </Typography>
          ))}
        </Typography>
      </Box>
    </Modal>
  );
});

export default ServiceModal;
