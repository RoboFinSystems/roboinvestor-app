'use client'

import { SettingsContainer } from '@/components/layouts/SettingsContainer'
import {
  ApiKeysCard,
  GeneralInformationCard,
  PasswordInformationCard,
  SettingsPageHeader,
} from '@/lib/core'
import { customTheme } from '@/lib/core/theme'
import type { User } from '@/lib/core/types'
import type { FC } from 'react'

export interface UserProps {
  user: User
}

const UserSettingsPageContent: FC<UserProps> = function ({ user }) {
  return (
    <>
      <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4">
        <SettingsPageHeader title="User settings" homeHref="/home" />
      </div>
      <SettingsContainer>
        <GeneralInformationCard
          user={{
            ...user,
            name: user.name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }}
          theme={customTheme}
        />
        <PasswordInformationCard theme={customTheme} />
        <ApiKeysCard theme={customTheme} />
      </SettingsContainer>
    </>
  )
}

export default UserSettingsPageContent
