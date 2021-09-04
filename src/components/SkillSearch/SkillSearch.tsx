import _debounce from 'lodash.debounce';
import AppContext from '../../AppContext';
import Nullable from '../../models/Nullable';
import React from 'react';
import SkillDetail from '../SkillDetail/SkillDetail';
import SkillSearchResult from '../../models/SkillSearchResult';
import { DebouncedFunc } from 'lodash';
import { guardedTrim, hasAny } from '../../utils';
import { List, Portal, Searchbar } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';

interface SkillsSearchProps {
  onHide(): void;
}

interface SkillsSearchState {
  search: string;
  result: SkillSearchResult[];
  skill: Nullable<SkillSearchResult>;
}

class SkillSearch extends React.Component<
  SkillsSearchProps,
  SkillsSearchState
> {
  static contextType = AppContext;
  declare context: React.ContextType<typeof AppContext>;

  private findSkill: DebouncedFunc<(str: string) => void> = _debounce(str => {
    console.warn('findSkill default not replaced in componentDidMount', str);
  }, 1000);

  constructor(props: SkillsSearchProps) {
    super(props);
    this.state = {
      search: '',
      result: [],
      skill: null,
    };
  }

  componentDidMount() {
    this.findSkill = _debounce(str => {
      if (str.length < 1) {
        this.setResult([]);
      } else {
        this.context.db
          .findSkill(str, 5)
          .then(res => {
            this.setResult(res);
          })
          .catch(() => this.setResult([]));
      }
    }, this.context.settings.skillsSearchDebounceMs);
  }

  doSearch = (str: string) => {
    const search = guardedTrim(str);
    this.setState(
      state => {
        return { ...state, search };
      },
      () => this.findSkill(search),
    );
  };

  setResult = (result: SkillSearchResult[]) => {
    this.setState(state => {
      return { ...state, result };
    });
  };

  setSkill = (skill: Nullable<SkillSearchResult>) => {
    this.setState(state => {
      return { ...state, skill };
    });
  };

  handleBlur = () => {
    if (this.state.skill == null) {
      this.props.onHide();
    }
  };

  handleDismiss = () => {
    this.setState(
      state => {
        return { ...state, skill: null };
      },
      () => this.props.onHide(),
    );
  };

  render() {
    return (
      <Portal>
        <View>
          <Searchbar
            style={styles.searchbar}
            placeholder="Find a skill"
            onChangeText={this.doSearch}
            onIconPress={() => this.props.onHide()}
            value={this.state.search}
            autoFocus={true}
            onBlur={this.handleBlur}
          />
          {hasAny(this.state.result) && (
            <View style={styles.results}>
              {this.state.result.map(r => (
                <List.Item
                  key={r.id}
                  title={r.title}
                  onPress={() => this.setSkill(r)}
                />
              ))}
            </View>
          )}
        </View>
        {this.state.skill && (
          <SkillDetail
            skill={this.state.skill}
            onDismiss={() => this.handleDismiss()}
          />
        )}
      </Portal>
    );
  }
}

const styles = StyleSheet.create({
  results: {
    backgroundColor: 'white',
    top: 20,
  },
  searchbar: {
    top: 20,
  },
});

export default SkillSearch;
