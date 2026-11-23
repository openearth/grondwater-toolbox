<template>
  <v-alert
    dense
    outlined
    :type="cells === null || cells > limit ? 'error' : 'info'"
  >
    <template v-if="cells === null">
      De schatting van het aantal cellen is niet beschikbaar. Controleer het modelgebied en de rekenresolutie.
    </template>
    <template v-else>
      Geschat aantal horizontale cellen: {{ Math.ceil(cells).toLocaleString('nl-NL') }}
      (maximum: {{ limit.toLocaleString('nl-NL') }}).
      <template v-if="cells > limit">
        Verklein het modelgebied of kies, indien mogelijk, een grotere rekenresolutie.
      </template>
      Dit is een schatting; het werkelijke aantal cellen kan afwijken.
    </template>
  </v-alert>
</template>

<script>
  import { MAX_ESTIMATED_CELLS } from '@/lib/calculation-estimate';

  export default {
    props: {
      cells: {
        type: Number,
        default: null,
      },
    },
    data() {
      return { limit: MAX_ESTIMATED_CELLS };
    },
  };
</script>
