import { useEntityQuery } from "@latticexyz/react";
import { getComponentValue, Has } from "@latticexyz/recs";
import { ActionState } from "@latticexyz/std-client";
import styled from "styled-components";
import { useMUD } from "../../store";
import { Button } from "../theme/Button";

type Props = {
  label: string;
  actionFunction: () => void;
  actionName: string;
  className?: string;
  style?: React.CSSProperties;
};

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const useActionButton = ({
  label,
  actionName,
  actionFunction,
  className,
  style,
}: Props) => {
  const {
    networkLayer: {
      world,
      actions: { Action },
    },
  } = useMUD();

  const actionIndex = useEntityQuery([Has(Action)]).find((i) => {
    const action = getComponentValue(Action, i);
    if (
      [ActionState.Complete, ActionState.TxReduced].includes(
        action?.state as ActionState
      )
    )
      return false;

    return world.entities[i].includes(actionName);
  });
  const action = actionIndex && getComponentValue(Action, actionIndex);
  const actionPending = Boolean(
    action &&
      [ActionState.Requested, ActionState.Executing].includes(action.state)
  );

  return {
    action,
    actionPending,
    button: (
      <Button
        onClick={actionFunction}
        disabled={actionPending}
        className={className}
        style={style}
      >
        {actionPending ? <LoadingSpinner /> : label}
      </Button>
    ),
  };
};
