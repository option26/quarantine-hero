import React from 'react';
import Box from "@material-ui/core/Box";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from "react-share";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Link from "@material-ui/core/Link";

export default function ShareButtons(props) {

  const linkToShare = "https://www.quarantaenehelden.org/";

  const CopyToClipboardButton = (
    <Link
      href={"#"}
      onClick={(event) => {
        event.preventDefault();
        navigator.clipboard.writeText(linkToShare);
      }}
    >
      <Box display="flex"
           justifyContent="center"
           alignItems="center"
           mx={.2}
           style={{"width": "40px", "height": "40px"}}
           className="bg-primary text-white">
        <FileCopyIcon/>
      </Box>
    </Link>
  );

  return (
    <Box style={{...props.style}}>
      {CopyToClipboardButton}
      <Box mx={.2}>
        <EmailShareButton url={linkToShare}>
          <EmailIcon size={40} round={false}/>
        </EmailShareButton>
      </Box>
      <Box mx={.2}>
        <FacebookShareButton url={linkToShare}>
          <FacebookIcon size={40} round={false}/>
        </FacebookShareButton>
      </Box>
      <Box mx={.2}>
        <TwitterShareButton url={linkToShare}>
          <TwitterIcon size={40} round={false}/>
        </TwitterShareButton>
      </Box>
      <Box mx={.2}>
        <TelegramShareButton url={linkToShare}>
          <TelegramIcon size={40} round={false}/>
        </TelegramShareButton>
      </Box>
      <Box mx={.2}>
        <WhatsappShareButton url={linkToShare}>
          <WhatsappIcon size={40} round={false}/>
        </WhatsappShareButton>
      </Box>
    </Box>
  );
}
