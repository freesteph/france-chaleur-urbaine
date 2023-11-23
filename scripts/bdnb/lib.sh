sql="psql --quiet --no-align --pset=tuples_only postgres://postgres:postgres_fcu@localhost:5432"

# Exécute une requête sur une table en la découpant en sous-tables
# Puis la table finale est réassemblée à partir des sous-tables.
split_bdnb_table_query() {
  local outputTable="$1"
  if [[ -z $outputTable ]]; then
    echo "Missing param outputTable" >&2
    return 1
  fi
  local query="$2"
  if [[ -z $query ]]; then
    echo "Missing param query" >&2
    return 1
  fi

  echo "> Début de création de la table $outputTable"

  # spécifique à la volumétrie de la BDNB
  local seriesQueryPart="
  SELECT
    generate_series(1, 24000000, 10000) as start_id,
    generate_series(10000, 24000000, 10000) as end_id
  "

  echo "> Suppression des tables temporaires"
  local dropTableQueries="$(
    $sql <<EOF
  SELECT
    'drop table if exists ${outputTable}_' || row_number() over () || ';'
  FROM (
    $seriesQueryPart
  ) as sub;
EOF
  )"

  # 1. Suppression des tables temporaires et de la table cible si existantes
  $sql <<EOF
  $dropTableQueries
  drop table if exists $outputTable;
EOF

  SECONDS=0
  local queries=$(
    $sql -F SEPARATOR <<EOF
  SELECT
    'create unlogged table ${outputTable}_' || row_number() over () || ' as ($query WHERE id BETWEEN ' || start_id || ' AND ' || end_id || '); select ''${outputTable}_' || row_number() over () || '''; SEPARATOR'
  FROM (
    $seriesQueryPart
  ) as sub;
EOF
  )
  parallel --jobs $(nproc) --delimiter SEPARATOR /usr/bin/time -f '%E' $sql -c "{}" <<EOF
  $queries
EOF

  echo "> Tables temporaires créées ($SECONDS secondes)"

  # 3. Réassemblage de la table
  SECONDS=0
  queries=$(
    $sql <<EOF
  select string_agg('SELECT * FROM ${outputTable}_' || id, ' UNION ALL ')
  from (
    select row_number() over () as id
    FROM (
      $seriesQueryPart
    ) c1
  ) c2
EOF
  )
  $sql <<EOF
  CREATE TABLE $outputTable AS ($queries)
EOF
  echo "> Table finale assemblée $outputTable ($SECONDS secondes)"

  echo "> Suppression des tables temporaires"
  # 4. Suppression des tables temporaires
  $sql <<EOF
  $dropTableQueries
EOF
}
