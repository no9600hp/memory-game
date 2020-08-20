import { Statistic } from '../statistic/statistic'

/**
 * Scores Template Component.
 */
export interface ScoresTemplateComponent {
  /**
   * Receive the scores
   */
  readonly scores: Statistic[]

  /**
   * Title to show.
   */
  title: string

  /**
   * First Column name.
   */
  column: string
}
