import React from "react"
import { Box, Button, Collapse, Tooltip } from "@chakra-ui/react"

function JSONViewer({ children }) {
  const [show, setShow] = React.useState(false)

  const handleToggle = () => setShow(!show)

  return (
    <Box style={{ background: '#2f3136', padding: '8px 8px 1px 8px', width: 'calc(100vw - 24px)' }}>
      <Collapse startingHeight={147} style={{ overflow: 'scroll', bg: '#2f3136', borderRadius: '4px' }} in={show}>
        <pre>
          <code>{children}</code>
        </pre>
      </Collapse>
      <hr/>
      <Box display='flex' alignItems='center' onClick={handleToggle}>
        <Tooltip hasArrow label={
          <Box>
            {show ? 'Collapse' : 'Expand'} ({children.split(/\r\n|\r|\n/).length} Lines)
          </Box>
        } placement='top' shouldWrapChildren bg="blurple">
          <svg style={{ margin: '8px', transition: 'transform 0.2s', transform: `rotate(${(show ? 0 : 180)}deg)` }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M12 10L8 6L4 10"
              stroke="#bcbcbc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Tooltip>
        {show ? 'Collapse' : 'Expand'}

      </Box>

    </Box>
  )
}

export default JSONViewer