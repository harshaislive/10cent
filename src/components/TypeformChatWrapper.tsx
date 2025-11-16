'use client'

import TypeformChat from './TypeformChat'

export default function TypeformChatWrapper() {
  return (
    <TypeformChat 
      tooltip="Questions about 10cent Club? Chat with us!"
      onSubmit={() => console.log('Chat form submitted')}
    />
  )
}