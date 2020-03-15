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

export default function ShareButtons(props) {

  const linkToShare = "https://www.quarantaenehelden.org/";

  return (
    <Box style={props.style}>
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
