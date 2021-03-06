/**

Copyright 2019 Forestry.io Inc

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

import * as React from 'react'
import { FormBuilder, FieldsBuilder } from '@tinacms/form-builder'

import { Form } from '@tinacms/forms'
import styled, { keyframes, StyledComponent } from 'styled-components'
import {
  Button,
  padding,
  color,
  font,
  timing,
  radius,
  shadow,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ThemeProps,
} from '@tinacms/styles'
import { FormActionMenu } from './FormActions'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { LoadingDots } from './LoadingDots'
import { ResetForm } from './ResetForm'
import { useCMS } from '../../react-tinacms'
import { FormPortalProvider } from './FormPortal'

export interface FormViewProps {
  activeForm: Form
}
export function FormView({ activeForm }: FormViewProps) {
  const cms = useCMS()
  const moveArrayItem = React.useCallback(
    (result: DropResult) => {
      if (!result.destination || !activeForm) return
      const name = result.type
      activeForm.mutators.move(
        name,
        result.source.index,
        result.destination.index
      )
    },
    [activeForm]
  )

  return (
    <FormBuilder form={activeForm as any}>
      {({ handleSubmit, pristine, form, submitting }) => {
        return (
          <DragDropContext onDragEnd={moveArrayItem}>
            <FormBody>
              <FormPortalProvider>
                <Wrapper>
                  {activeForm &&
                    (activeForm.fields.length ? (
                      <FieldsBuilder
                        form={activeForm}
                        fields={activeForm.fields}
                      />
                    ) : (
                      <NoFieldsPlaceholder />
                    ))}
                </Wrapper>
              </FormPortalProvider>
            </FormBody>
            <FormFooter>
              <Wrapper>
                {activeForm.reset && (
                  <ResetForm
                    pristine={pristine}
                    reset={async () => {
                      form.reset()
                      await activeForm.reset!()
                    }}
                  >
                    {cms.sidebar.buttons.reset}
                  </ResetForm>
                )}
                <Button
                  onClick={() => handleSubmit()}
                  disabled={pristine}
                  busy={submitting}
                  primary
                  grow
                  margin
                >
                  {submitting && <LoadingDots />}
                  {!submitting && cms.sidebar.buttons.save}
                </Button>
                {activeForm.actions.length > 0 && (
                  <FormActionMenu
                    actions={activeForm.actions}
                    form={activeForm}
                  />
                )}
              </Wrapper>
            </FormFooter>
          </DragDropContext>
        )
      }}
    </FormBuilder>
  )
}

const Emoji = styled.span`
  font-size: 40px;
  line-height: 1;
  display: inline-block;
`

const EmptyStateAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const EmptyState = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${padding()} ${padding()} 64px ${padding()};
  width: 100%;
  height: 100%;
  overflow-y: auto;
  animation-name: ${EmptyStateAnimation};
  animation-delay: 300ms;
  animation-timing-function: ease-out;
  animation-iteration-count: 1;
  animation-fill-mode: both;
  animation-duration: 150ms;
  > *:first-child {
    margin: 0 0 ${padding()} 0;
  }
  > ${Emoji} {
    display: block;
  }
  h3 {
    font-size: ${font.size(5)};
    font-weight: normal;
    color: inherit;
    display: block;
    margin: 0 0 ${padding()} 0;
    ${Emoji} {
      font-size: 1em;
    }
  }
  p {
    display: block;
    margin: 0 0 ${padding()} 0;
  }
`

const LinkButton = styled.a`
  text-align: center;
  border: 0;
  border-radius: ${radius('big')};
  border: 1px solid ${color.grey(2)};
  box-shadow: ${shadow('small')};
  font-weight: 500;
  cursor: pointer;
  font-size: ${font.size(0)};
  transition: all ${timing('short')} ease-out;
  background-color: white;
  color: ${color.grey(8)};
  padding: ${padding('small')} ${padding('big')} ${padding('small')} 56px;
  position: relative;
  text-decoration: none;
  display: inline-block;
  ${Emoji} {
    font-size: 24px;
    position: absolute;
    left: ${padding('big')};
    top: 50%;
    transform-origin: 50% 50%;
    transform: translate3d(0, -50%, 0);
    transition: all ${timing('short')} ease-out;
  }
  &:hover {
    color: ${color.primary()};
    ${Emoji} {
      transform: translate3d(0, -50%, 0);
    }
  }
`

const NoFieldsPlaceholder = () => (
  <EmptyState>
    <Emoji>🤔</Emoji>
    <h3>Hey, you don't have any fields added to this form.</h3>
    <p>
      <LinkButton
        href="https://tinacms.org/docs/gatsby/markdown/#creating-remark-forms"
        target="_blank"
      >
        <Emoji>📖</Emoji> Field Setup Guide
      </LinkButton>
    </p>
  </EmptyState>
)

export const Wrapper = styled.div`
  display: block;
  margin: 0 auto;
  max-width: 500px;
  width: 100%;
`

export const FormBody: StyledComponent<'div', {}, {}> = styled.div`
  position: relative;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid ${color.grey(2)};
  background-color: #f6f6f9;

  ${Wrapper} {
    height: 100%;
    scrollbar-width: none;
  }
`

const FormFooter = styled.div`
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  background-color: white;
  border-top: 1px solid ${color.grey(2)};

  ${Wrapper} {
    flex: 1 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
  }
`

export const SaveButton: StyledComponent<typeof Button, {}, {}> = styled(
  Button
)`
  flex: 1.5 0 auto;
  padding: 12px 24px;
`
